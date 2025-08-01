import { ProcessPaymentOnOrderCreatedUseCase } from '@application/use-cases/payment/ProcessPaymentOnOrderCreated.useCase';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';
import { Payment } from '@core/entities/payment.entity';

const mockPaymentRepository = {
  findByOrderId: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
};
const mockSnsPublisher = { publish: jest.fn() } as unknown as jest.Mocked<SnsPublisher>;

describe('ProcessPaymentOnOrderCreatedUseCase', () => {
  it('should create the payment and emit event', async () => {
    mockPaymentRepository.save.mockResolvedValue(Payment.create({ orderId: 'order-1', status: 'PROCESSING' }));
    const useCase = new ProcessPaymentOnOrderCreatedUseCase(mockPaymentRepository, mockSnsPublisher);
    const result = await useCase.execute({ orderId: 'order-1', amount: 100 });
    expect(result.status).toBe('PROCESSING');
    expect(mockPaymentRepository.save).toHaveBeenCalledWith(expect.any(Payment));
    expect(mockSnsPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'PAYMENT_STARTED' }));
  });
});
