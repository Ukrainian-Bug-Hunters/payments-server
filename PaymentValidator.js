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
    const errors = [];
    
    if(!this.isDate(payment)) {
      errors.push(`payment date is wrong: ${payment.date}`);
    };
    
    if(!this.isCurrency(payment)) {
      errors.push(`payment currency is wrong: ${payment.currency}`);
    };
    
    if(!this.isValidNumber(payment.amount)) {
      errors.push(`payment amount is wrong: ${payment.amount}`);
    };
    
    if(!this.isValidNumber(payment.exchangeRate)) {
      errors.push(`payment exchangerate is wrong: ${payment.exchangeRate}`);
    };

    if(!this.isDescription(payment)) {
      errors.push(`payment description is wrong: ${payment.description}`);
    };

    return errors;
  }
}

const paymentValidator = new PaymentValidator();

export default paymentValidator;