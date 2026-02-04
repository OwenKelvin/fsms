import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import * as process from 'process';
import { MpesaStkRequestService } from './mpesa-stk-request.service';
import { QuoteBackendService } from '@fsms/backend/quote-backend-service';
import { QuoteModel } from '@fsms/backend/db';

export interface ISTKPushRequest {
  ['MerchantRequestID']: string;
  ['CheckoutRequestID']: string;
  ['ResponseCode']: string;
  ['ResponseDescription']: string;
  ['CustomerMessage']: string;
}

@Injectable()
export class MpesaService {
  private readonly url = process.env['FSMS_SAFARICOM_MPESA_URL'];
  private readonly timestamp = new Date()
    .toISOString()
    .replace(/\D/g, '')
    .slice(0, 14);
  private readonly consumerKey = process.env['FSMS_MPESA_CONSUMER_KEY'];
  private readonly consumerSecret = process.env['FSMS_MPESA_CONSUMER_SECRET'];
  private readonly passKey = process.env['FSMS_MPESA_PASS_KEY'];
  private readonly shortCode = Number(process.env['FSMS_MPESA_SHORT_CODE']);
  private readonly password = Buffer.from(
    `${this.shortCode}${this.passKey}${this.timestamp}`,
  ).toString('base64');
  private readonly oauthPassword = Buffer.from(
    `${this.consumerKey}:${this.consumerSecret}`,
  ).toString('base64');

  constructor(
    private mpesaStkRequestService: MpesaStkRequestService,
    private quoteService: QuoteBackendService,
  ) {}

  async authorize() {
    return await axios
      .get<{
        ['access_token']: string;
        ['expires_in']: number;
      }>(`${this.url}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${this.oauthPassword}`,
        },
      })
      .then((res) => res.data);
  }

  async requestTransactionStatus(transactionRef: string) {
    const authorizationToken = await this.authorize();

    const stkPushResponse = await axios
      .post<ISTKPushRequest>(
        `${this.url}/mpesa/transactionstatus/v1/query`,
        {
          Initiator: 'testapi',
          SecurityCredential:
            'k4Zb4M0m/aUJZmZwKmzzjq6Ha58KTzZzpsUpLLHRYjEeMvMoXNAXJDPywh7glRENmXK8s+Nk6LZ3BQDYVtwWoVJAMc8KYZPs044V7FX6+7rGOteNBUY+wGPbxNFBQGI/DUFG1HDvsac4eVbtT0nycoNw1zywDRl3YL2o3Q9drgWrFE6O5bNJKG4K36rVLYXgJEXy9h1Kbq9/Y3M9ec3u8R6c5vX4ZtmXWhbGDDg2kDiFn7Zus5DvDVBETTEiAv+CKe1EfG2vUxlVfE/E1XAQvjYcqILI1uOyq3XKwNNQre2ts5vDfXhziCetQoYwfZN/mdooeJm0UfenWhsdcy9fTA==',
          CommandID: 'TransactionStatusQuery',
          TransactionID: 'OEI2AK4Q16',
          PartyA: 600983,
          IdentifierType: '4',
          ResultURL: `${process.env['FSMS_MPESA_CALLBACK_BASE']}/api/payment-callback/transaction-status/result`,
          QueueTimeOutURL: `${process.env['FSMS_MPESA_CALLBACK_BASE']}/api/payment-callback/transaction-status/timeout`,
          Remarks: 'Test',
          Occassion: 'Testing',
        },
        {
          headers: {
            Authorization: `Bearer ${authorizationToken['access_token']}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((res) => {
        if (res.response?.data?.['errorMessage']) {
          throw new BadRequestException(res.response.data['errorMessage']);
        } else {
          throw new InternalServerErrorException(
            'We have encountered a problem executing your request, please try again later',
          );
        }
      });
    console.log(transactionRef, stkPushResponse);
  }

  async requestStkPush(
    phoneNumber: string,
    quoteId: string,
    defaultParams: Record<string, string>,
  ) {
    const quote = (await this.quoteService.findById(quoteId)) as QuoteModel;
    const authorizationToken = await this.authorize();

    const stkPushResponse = await axios
      .post<ISTKPushRequest>(
        `${this.url}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.shortCode,
          Password: this.password,
          Timestamp: this.timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(quote.totalCost ?? 0),
          PartyA: Number(phoneNumber.replace('+', '')),
          PartyB: this.shortCode,
          PhoneNumber: Number(phoneNumber.replace('+', '')),
          CallBackURL: `${process.env['FSMS_MPESA_CALLBACK_BASE']}/api/payment-callback/stk-push-request`,
          AccountReference: 'Tahiniwa',
          TransactionDesc: 'Plan Payment',
        },
        {
          headers: {
            Authorization: `Bearer ${authorizationToken['access_token']}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((res) => {
        if (res.response?.data?.['errorMessage']) {
          throw new BadRequestException(res.response.data['errorMessage']);
        } else {
          throw new InternalServerErrorException(
            'We have encountered a problem executing your request, please try again later',
          );
        }
      });
    return await this.mpesaStkRequestService.create({
      ...defaultParams,
      merchantRequestId: stkPushResponse.data['MerchantRequestID'],
      checkoutRequestId: stkPushResponse.data['CheckoutRequestID'],
      responseCode: stkPushResponse.data['ResponseCode'],
      quoteId,
      responseDescription: stkPushResponse.data['ResponseDescription'],
      customerMessage: stkPushResponse.data['CustomerMessage'],
    });
  }
}
