import { createConvertDelta } from '../../../src/factories/convert-delta';
import { stub } from 'sinon';

describe('createConvertDelta()', () => {
    let convertDelta;
    let formRemoveStatement;
    let formSetStatement;

    beforeEach(() => {
        formRemoveStatement = stub();
        formSetStatement = stub();

        convertDelta = createConvertDelta(formRemoveStatement, formSetStatement);

        formRemoveStatement.returns('a fake remove statement');
        formSetStatement.returns('a fake set statement');
    });

    describe('with an undefined property', () => {
        let delta;

        beforeEach(() => (delta = { property: undefined }));

        it('should call formRemoveStatement()', () => {
            convertDelta(delta);

            const expressionAttributeNames = formRemoveStatement.getCall(0).args[1];

            expect(expressionAttributeNames).to.deep.equal({});
            expect(formRemoveStatement).to.have.been.calledOnce.and.calledWithExactly('property', expressionAttributeNames);
        });

        describe('without any modifications', () => {
            it('should return update params with a remove statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: undefined,
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'REMOVE a fake remove statement'
                });
            });
        });

        describe('with modified expressionAttributeNames', () => {
            beforeEach(() => {
                formRemoveStatement.callsFake((_1, expressionAttributeNames) => {
                    expressionAttributeNames['new'] = 'value';

                    return 'a fake remove statement';
                });
            });

            it('should return update params with a remove statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: { new: 'value' },
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'REMOVE a fake remove statement'
                });
            });
        });
    });

    describe('with a property with a value other than undefined', () => {
        let delta;

        beforeEach(() => (delta = { property: 'a string' }));

        it('should call formSetStatement()', () => {
            convertDelta(delta);

            const [, , expressionAttributeNames, expressionAttributeValues] = formSetStatement.getCall(0).args;

            expect(expressionAttributeNames).to.deep.equal({});
            expect(expressionAttributeValues).to.deep.equal({});
            expect(formSetStatement).to.have.been.calledOnce.and.calledWithExactly(
                'property',
                'a string',
                expressionAttributeNames,
                expressionAttributeValues
            );
        });

        describe('without any modifications', () => {
            it('should return update params with a set statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: undefined,
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'SET a fake set statement'
                });
            });
        });

        describe('with modified expressionAttributeNames', () => {
            beforeEach(() => {
                formSetStatement.callsFake((_1, _2, expressionAttributeNames) => {
                    expressionAttributeNames['new'] = 'value';

                    return 'a fake set statement';
                });
            });

            it('should return update params with a set statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: { new: 'value' },
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'SET a fake set statement'
                });
            });
        });

        describe('with modified expressionAttributeValues', () => {
            beforeEach(() => {
                formSetStatement.callsFake((_1, _2, _3, expressionAttributeValues) => {
                    expressionAttributeValues['new'] = 'value';

                    return 'a fake set statement';
                });
            });

            it('should return update params with a set statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: undefined,
                    ExpressionAttributeValues: {
                        new: 'value'
                    },
                    UpdateExpression: 'SET a fake set statement'
                });
            });
        });
    });
});
