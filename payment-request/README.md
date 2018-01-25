Examples:

* [Feature Detect Support](feature-detect-support.html). Demonstrates using PaymentRequest if it is supported, otherwise falling back to a legacy web form.
* [Customizing Button Depending on Whether User Can Make Payments](customize-button-can-make-payment.html). Demonstrates changing the title of the checkout button depending on whether the user can make a fast payment or they need to add payment credentials first.
* [Recommend Payment App when User Has No Apps](recommend-payment-app.html). Demonstrates redirecting to a signup page for a payment app when the payment method is not supported.
* [Check User Can Make Payment Before All Prices Known](check-user-can-make-payment.html). Demonstrates checking the user can make a payment before the line items and their prices are known, using `.canMakePayment()` with dummy data.
* [Show Additional User Interface After Successful Payment](show-additional-ui-after-payment.html). Demonstrates showing another page for additional information collection, after the checkout.
* [Pre-authorize Transaction](pre-authorize-transaction.html). Indicates how a Payment Handler could be used to return an authorization status, subject to the specification at the time of writing.

External Examples:

* [Payment Request Samples](https://googlechrome.github.io/samples/paymentrequest/) from Google
* [Payment Request Codelab](https://codelabs.developers.google.com/codelabs/payment-request-api/#0) from Google
* [VeggieShop](https://github.com/pjbazin/wpwg-demo) e-commerce website demo and source code
* [WhiteCollar](https://github.com/pjbazin/wpwg-demo/tree/master/WhiteCollar) web payment app demo and source code
