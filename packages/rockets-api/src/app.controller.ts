import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('json-schema/testing')
  liveForm() {
    return {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid",
          "title": "Id",
          "description": "The primary key of the resource."
        },
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "title": "Created At",
          "description": "The date and time at which the resource was created."
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time",
          "title": "Updated At",
          "description": "The date and time at which the resource was last updated."
        },
        "orderId": {
          "type": "number",
          "title": "SP Order ID"
        },
        "purpose": {
          "type": "string",
          "title": "SP Purpose",
          "enum": [
            "Unspecified",
            "Cancellation",
            "Change",
            "Original",
            "Confirmation",
            "Other",
            "Pending"
          ]
        },
        "orderType": {
          "type": "string",
          "title": "SP order type",
          "enum": [
            "PurchaseOrder",
            "WorkOrder",
            "Memo",
            "MeasurementPO",
            "ExtraPO",
            "FixedContractPO",
            "NotToExceedEPO",
            "NotToExceedPO"
          ]
        },
        "builderOrderNumber": {
          "type": "string",
          "title": "SP builder order number"
        },
        "changeType": {
          "type": "string",
          "title": "SP change type",
          "enum": [
            "ChangeInHeadingSection",
            "ChangeInDetail",
            "Reschedule",
            "NotesOnly"
          ]
        },
        "changeOrderNumber": {
          "type": "string",
          "title": "change order number"
        },
        "changeOrderSequence": {
          "type": "number",
          "title": "Change order sequence"
        },
        "builderName": {
          "type": "string",
          "title": "Builder name"
        },
        "builderNameId": {
          "type": "string",
          "format": "uuid",
          "title": "Builder name Id",
          "description": "Builder name Id"
        },
        "subdivisionName": {
          "type": "string",
          "title": "Subdivision name"
        },
        "subdivisionNameId": {
          "type": "string",
          "format": "uuid",
          "title": "Subdivision name Id",
          "description": "Subdivision name Id"
        },
        "jobPlan": {
          "type": "string",
          "title": "Job plan"
        },
        "jobPlanId": {
          "type": "string",
          "format": "uuid",
          "title": "Job plan Id",
          "description": "Job plan Id"
        },
        "jobLot": {
          "type": "string",
          "title": "Job lot"
        },
        "jobGroupDescription": {
          "type": "string",
          "title": "Job group description"
        },
        "jobStreet": {
          "type": "string",
          "title": "Job street"
        },
        "jobStreetSupplement": {
          "type": "string",
          "title": "Job street supplement"
        },
        "jobCity": {
          "type": "string",
          "title": "Job city"
        },
        "jobStateCode": {
          "type": "string",
          "title": "Job state code"
        },
        "jobPostalCode": {
          "type": "string",
          "title": "Job postal code"
        },
        "taskName": {
          "type": "string",
          "title": "Task name"
        },
        "taskNum": {
          "type": "string",
          "title": "Task num"
        },
        "taskDescription": {
          "type": "string",
          "title": "Task description"
        },
        "options": {
          "type": "string",
          "title": "Options"
        },
        "jobId": {
          "type": "string",
          "format": "uuid",
          "title": "Job Id",
          "description": "Job Id"
        }
      }
    };

    /*
    return {
      properties: {
        email: {
          type: 'string',
          title: 'Email',
        },
        password: {
          type: 'string',
          title: 'Password',
        },
        checkbox: { type: 'boolean', title: 'Subscribe' },
        checkboxes: {
          title: 'Your kind of drinks',
          enum: ['Beer', 'Vodka', 'Champagne', 'Rum', 'Gin'],
        },
        character: {
          title: "Who's your favorite character",
          enum: ['Mario', 'Sonic', 'Lara Croft', 'Pac-man'],
        },
        series: {
          title: 'Favorite series',
          enum: [
            'strangerThings',
            'gameOfThrones',
            '13ReasonsWhy',
            'greysAnatomy',
            'moneyHeist',
          ],
        },
        address: { type: 'string', title: 'Address' },
        multiAddress: {
          type: 'array',
          title: 'Multi Address',
          items: [
            {
              type: 'string',
              title: 'Address',
            },
            {
              type: 'string',
              title: 'City',
            },
            {
              type: 'string',
              title: 'Type of address',
              enum: ['House', 'Apartment', 'Commercial building'],
            },
            {
              type: 'boolean',
              title: 'Is home address',
            },
          ],
        },
        radio: {
          title: 'Which is your favorite for gaming?',
          enum: ['ps5', 'xbox', 'pc', 'mobile'],
        },
        switch: {
          title: 'Is this thing on?',
        },
      },
      required: ['email', 'password'],
    }
    */
  }
}
