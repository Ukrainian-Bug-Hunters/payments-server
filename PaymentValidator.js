import currencies from './currencies.js'

class PaymentValidator {
  isCurrency(payment) {
    return currencies.includes(payment.currency);
  }

  isDescription(payment) {
    return (
      payment.description !== '' && 
      payment.description !== null && 
      payment.description !== undefined
    );
  }

  isValidNumber(value) {
    return (
      value !== '' &&
      value !== null &&
      Number(value) >= 0
    );
  }

  isDate(payment) {
    const currentDate = new Date().toLocaleDateString('fr-CA');
    return payment.date >= currentDate;
  }

  validate(payment) {
    const errors = {};
    
    if(!this.isDate(payment)) {
      Object.assign(errors, {"wrong date": payment.date});
    };
    
    if(!this.isCurrency(payment)) {
      Object.assign(errors, {"wrong currency": payment.currency});
    };
    
    if(!this.isValidNumber(payment.amount)) {
      Object.assign(errors, {"wrong amount": payment.amount});
    };
    
    if(!this.isValidNumber(payment.exchangeRate)) {
      Object.assign(errors, {"wrong exchangerate": payment.exchangeRate});
    };

    if(!this.isDescription(payment)) {
      Object.assign(errors, {"wrong description": payment.description});
    };

    return errors;
  }
}

const paymentValidator = new PaymentValidator();

export default paymentValidator;