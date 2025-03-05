const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// تعريف خيارات Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // إصدار OpenAPI
    info: {
      title: 'Electronics Backend API', // عنوان التوثيق
      version: '1.0.0', // إصدار التوثيق
      description: 'API documentation for Electronics Backend', // وصف التوثيق
    },
    servers: [
      {
        url: 'http://localhost:5000', // عنوان الخادم
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        // تعريف نماذج البيانات (Schemas)
        Accessory: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the accessory.',
            },
            quantity: {
              type: 'number',
              description: 'Quantity of the accessory.',
            },
            price: {
              type: 'number',
              description: 'Price of the accessory.',
            },
          },
        },
        ElectronicPart: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the electronic part.',
            },
            quantity: {
              type: 'number',
              description: 'Quantity of the electronic part.',
            },
            purchasePrice: {
              type: 'number',
              description: 'Purchase price of the electronic part.',
            },
            sellingPrice: {
              type: 'number',
              description: 'Selling price of the electronic part.',
            },
          },
        },
        Repair: {
          type: 'object',
          properties: {
            customerName: {
              type: 'string',
              description: 'Name of the customer.',
            },
            mobile: {
              type: 'string',
              description: 'Mobile number of the customer.',
            },
            issue: {
              type: 'string',
              description: 'Description of the issue.',
            },
            deliveryDate: {
              type: 'string',
              format: 'date',
              description: 'Expected delivery date.',
            },
          },
        },
        Technician: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the technician.',
            },
          },
        },
        Invoice: {
          type: 'object',
          properties: {
            partName: {
              type: 'string',
              description: 'Name of the part.',
            },
            quantity: {
              type: 'number',
              description: 'Quantity of the part.',
            },
            price: {
              type: 'number',
              description: 'Price of the part.',
            },
            amountPaid: {
              type: 'number',
              description: 'Amount paid by the technician.',
            },
            remainingAmount: {
              type: 'number',
              description: 'Remaining amount to be paid.',
            },
            totalRemaining: {
              type: 'number',
              description: 'Total remaining amount.',
            },
            isDebtor: {
              type: 'boolean',
              description: 'Whether the technician is a debtor.',
            },
          },
        },
      },
      securitySchemes: {
        // تعريف نظام الأمان (JWT)
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        // تطبيق الأمان على جميع الـ APIs
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // مسار ملفات المسارات
};

// إنشاء وثائق Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// تصدير الدالة لإعداد Swagger UI
module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};