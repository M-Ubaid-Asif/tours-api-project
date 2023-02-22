const stripe = Stripe(
  "pk_test_51KWZHJSHPqZZ8SC7FirBuPV0zYFUOxYRVBjGvm5ry86pTRceuEaIgKrpyPH3KDV123WipWOkrVZg376EsJPEaTd600UlhktuKf"
);

// import axios from "axios";

const bookTour = async (tourid) => {
  try {
    // get checkout session from api
    console.log("hey");
    const session = await axios(
      `http://localhost:9000/payment/checkout-session/${tourid}`
    );
    console.log("===>", session);

    // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {}
};

// const ele = document.getElementsByClassName('card-body')
const bookbtn = document.getElementById("abc");
// console.log('===>',bookbtn)
console.log(bookbtn);

if (bookbtn) {
  bookbtn.addEventListener("click", (event) => {
    bookbtn.textContent = "processing";
    const { tourId } = event.target.dataset;
    console.log(tourId);
    bookTour(tourId);
  });
}
