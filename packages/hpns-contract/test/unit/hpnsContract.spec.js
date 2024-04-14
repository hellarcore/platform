const crypto = require('crypto');

const {
  HellarPlatformProtocol, JsonSchemaError,
} = require('@hellarpro/wasm-hpp');
const generateRandomIdentifier = require('@hellarpro/wasm-hpp/lib/test/utils/generateRandomIdentifierAsync');

const { expect } = require('chai');
const hpnsContractDocumentsSchema = require('../../schema/hpns-contract-documents.json');

const expectJsonSchemaError = (validationResult, errorCount = 1) => {
  const errors = validationResult.getErrors();
  expect(errors).to.have.length(errorCount);

  const error = validationResult.getErrors()[0];
  expect(error).to.be.instanceof(JsonSchemaError);

  return error;
};

describe('HPNS Contract', () => {
  let hpp;
  let dataContract;
  let identityId;

  beforeEach(async () => {
    hpp = new HellarPlatformProtocol(
      { generate: () => crypto.randomBytes(32) },
    );

    identityId = await generateRandomIdentifier();

    dataContract = hpp.dataContract.create(identityId, hpnsContractDocumentsSchema);
  });

  it('should have a valid contract definition', async () => {
    expect(() => hpp.dataContract.create(identityId, hpnsContractDocumentsSchema)).to.not.throw();
  });

  describe('documents', () => {
    describe('preorder', () => {
      let rawPreorderDocument;

      beforeEach(() => {
        rawPreorderDocument = {
          saltedDomainHash: crypto.randomBytes(32),
        };
      });

      describe('saltedDomainHash', () => {
        it('should be defined', async () => {
          delete rawPreorderDocument.saltedDomainHash;

          const document = hpp.document.create(dataContract, identityId, 'preorder', rawPreorderDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('saltedDomainHash');
        });

        it('should not be empty', async () => {
          rawPreorderDocument.saltedDomainHash = Buffer.alloc(0);

          const document = hpp.document.create(dataContract, identityId, 'preorder', rawPreorderDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('minItems');
          expect(error.instancePath).to.deep.equal('/saltedDomainHash');
        });

        it('should be not less than 32 bytes', async () => {
          rawPreorderDocument.saltedDomainHash = crypto.randomBytes(10);

          const document = hpp.document.create(dataContract, identityId, 'preorder', rawPreorderDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('minItems');
          expect(error.instancePath).to.equal('/saltedDomainHash');
        });

        it('should be not longer than 32 bytes', async () => {
          rawPreorderDocument.saltedDomainHash = crypto.randomBytes(40);

          const document = hpp.document.create(dataContract, identityId, 'preorder', rawPreorderDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('maxItems');
          expect(error.instancePath).to.equal('/saltedDomainHash');
        });
      });

      it('should not have additional properties', async () => {
        rawPreorderDocument.someOtherProperty = 42;

        const document = hpp.document.create(dataContract, identityId, 'preorder', rawPreorderDocument);
        const validationResult = document.validate(hpp.protocolVersion);
        const error = expectJsonSchemaError(validationResult);

        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperties).to.deep.equal(['someOtherProperty']);
      });

      it('should be valid', async () => {
        const preorder = hpp.document.create(dataContract, identityId, 'preorder', rawPreorderDocument);

        const result = await preorder.validate(hpp.protocolVersion);

        expect(result.isValid()).to.be.true();
      });
    });

    describe('domain', () => {
      let rawDomainDocument;

      beforeEach(async () => {
        rawDomainDocument = {
          label: 'Wallet',
          normalizedLabel: 'wa11et', // lower case and base58 chars only
          normalizedParentDomainName: 'hellar',
          preorderSalt: crypto.randomBytes(32),
          records: {
            hellarUniqueIdentityId: await generateRandomIdentifier(),
          },
          subdomainRules: {
            allowSubdomains: false,
          },
        };
      });

      describe('label', () => {
        it('should be present', async () => {
          delete rawDomainDocument.label;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('label');
        });

        it('should follow pattern', async () => {
          rawDomainDocument.label = 'invalid label';

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('pattern');
          expect(error.instancePath).to.equal('/label');
        });

        it('should be longer than 3 chars', async () => {
          rawDomainDocument.label = 'ab';

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('minLength');
          expect(error.instancePath).to.equal('/label');
        });

        it('should be less than 63 chars', async () => {
          rawDomainDocument.label = 'a'.repeat(64);

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult, 2);

          expect(error.keyword).to.equal('pattern');
          expect(error.instancePath).to.equal('/label');
        });
      });

      describe('normalizedLabel', () => {
        it('should be defined', async () => {
          delete rawDomainDocument.normalizedLabel;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('normalizedLabel');
        });

        it('should follow pattern', async () => {
          rawDomainDocument.normalizedLabel = 'InValiD label';

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('pattern');
          expect(error.instancePath).to.equal('/normalizedLabel');
        });

        it('should be less than 63 chars', async () => {
          rawDomainDocument.normalizedLabel = 'a'.repeat(64);

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult, 2);

          expect(error.keyword).to.equal('pattern');
          expect(error.instancePath).to.equal('/normalizedLabel');
        });
      });

      describe('normalizedParentDomainName', () => {
        it('should be defined', async () => {
          delete rawDomainDocument.normalizedParentDomainName;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('normalizedParentDomainName');
        });

        it('should be less than 190 chars', async () => {
          rawDomainDocument.normalizedParentDomainName = 'a'.repeat(191);

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult, 2);

          expect(error.keyword).to.equal('pattern');
          expect(error.instancePath).to.equal('/normalizedParentDomainName');
        });

        it('should follow pattern', async () => {
          rawDomainDocument.normalizedParentDomainName = '&'.repeat(50);

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('pattern');
          expect(error.instancePath).to.equal('/normalizedParentDomainName');
        });
      });

      describe('preorderSalt', () => {
        it('should be defined', async () => {
          delete rawDomainDocument.preorderSalt;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('preorderSalt');
        });

        it('should not be empty', async () => {
          rawDomainDocument.preorderSalt = Buffer.alloc(0);

          hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('minItems');
          expect(error.instancePath).to.deep.equal('/preorderSalt');
        });

        it('should be not less than 32 bytes', async () => {
          rawDomainDocument.preorderSalt = crypto.randomBytes(10);

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('minItems');
          expect(error.instancePath).to.equal('/preorderSalt');
        });

        it('should be not longer than 32 bytes', async () => {
          rawDomainDocument.preorderSalt = crypto.randomBytes(40);

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('maxItems');
          expect(error.instancePath).to.equal('/preorderSalt');
        });
      });

      it('should not have additional properties', async () => {
        rawDomainDocument.someOtherProperty = [];

        const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);

        const validationResult = document.validate(hpp.protocolVersion);
        const error = expectJsonSchemaError(validationResult);

        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperties).to.deep.equal(['someOtherProperty']);
      });

      it('should be valid', async () => {
        const domain = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);

        const result = await domain.validate(hpp.protocolVersion);

        expect(result.isValid()).to.be.true();
      });

      describe('Records', () => {
        it('should be defined', async () => {
          delete rawDomainDocument.records;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('records');
        });

        it('should not be empty', async () => {
          rawDomainDocument.records = {};

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('minProperties');
          expect(error.instancePath).to.deep.equal('/records');
        });

        it('should not have additional properties', async () => {
          rawDomainDocument.records = {
            someOtherProperty: 42,
          };

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('additionalProperties');
          expect(error.instancePath).to.equal('/records');
          expect(error.params.additionalProperties).to.deep.equal(['someOtherProperty']);
        });

        describe('Hellar Identity', () => {
          it('should have either `hellarUniqueIdentityId` or `hellarAliasIdentityId`', async () => {
            rawDomainDocument.records = {
              hellarUniqueIdentityId: identityId,
              hellarAliasIdentityId: identityId,
            };

            const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
            const validationResult = document.validate(hpp.protocolVersion);
            const error = expectJsonSchemaError(validationResult);

            expect(error.keyword).to.equal('maxProperties');
            expect(error.instancePath).to.equal('/records');
          });

          describe('hellarUniqueIdentityId', () => {
            it('should no less than 32 bytes', async () => {
              rawDomainDocument.records = {
                hellarUniqueIdentityId: crypto.randomBytes(30),
              };

              expect(() => {
                hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
              }).to.throw();
            });

            it('should no more than 32 bytes', async () => {
              rawDomainDocument.records = {
                hellarUniqueIdentityId: crypto.randomBytes(64),
              };

              expect(() => {
                hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
              }).to.throw();
            });
          });

          describe('hellarAliasIdentityId', () => {
            it('should no less than 32 bytes', async () => {
              rawDomainDocument.records = {
                hellarAliasIdentityId: crypto.randomBytes(30),
              };

              expect(() => {
                hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
              }).to.throw();
            });

            it('should no more than 32 bytes', async () => {
              rawDomainDocument.records = {
                hellarAliasIdentityId: crypto.randomBytes(64),
              };

              expect(() => {
                hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
              }).to.throw();
            });
          });
        });
      });

      describe('subdomainRules', () => {
        it('should be defined', async () => {
          delete rawDomainDocument.subdomainRules;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('subdomainRules');
        });

        it('should not have additional properties', async () => {
          rawDomainDocument.subdomainRules.someOtherProperty = 42;

          const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
          const validationResult = document.validate(hpp.protocolVersion);
          const error = expectJsonSchemaError(validationResult);

          expect(error.keyword).to.equal('additionalProperties');
          expect(error.instancePath).to.equal('/subdomainRules');
          expect(error.params.additionalProperties).to.deep.equal(['someOtherProperty']);
        });

        describe('allowSubdomains', () => {
          it('should be boolean', async () => {
            rawDomainDocument.subdomainRules.allowSubdomains = 'data';

            const document = hpp.document.create(dataContract, identityId, 'domain', rawDomainDocument);
            const validationResult = document.validate(hpp.protocolVersion);
            const error = expectJsonSchemaError(validationResult);

            expect(error.keyword).to.equal('type');
            expect(error.instancePath).to.deep.equal('/subdomainRules/allowSubdomains');
          });
        });
      });
    });
  });
});
