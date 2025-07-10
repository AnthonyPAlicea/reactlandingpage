import {
	EleventyEdge,
	precompiledAppData,
} from "./_generated/eleventy-edge-app.js";

export default async (request, context) => {

  // Just return what was requested without transforming it, 
  // unless we fnd the coupon code query parameter
  const url = new URL(request.url);
  let coupon_code = null;
  if (!url.searchParams.get("coupon_code")) {
    return;
  } else {
    coupon_code = url.searchParams.get("coupon_code");
  }

  // Get the page content
  const response = await context.next();
  const page = await response.text();

  // Search for the placeholder
  const regex1 = /SET_PRICE/i;
  const regex2 = /LIST_PRICE/i;
  const regex3 = /LIST_COMPLETEPRICE/i;

  // Coupons
  const coupons = [
    { code: 'WPP', type:'I', newPrice: "99<small>.83</small>" },
    { code: 'SPRING2025', type:'I', newPrice: "99<small>.83</small>" },
    { code: 'PPPREQUEST', type:'I', newPrice: "37<small>.25</small>" },
    { code: 'JSJABBER', type:'I', newPrice: "99" },
    { code: 'REACTIFLUX', type:'I', newPrice: "99<small>.83</small>" },
    { code: 'UDEMYSTUDENT', type:'I', newPrice: "129", newCompletePrice: "229" },
    { code: 'PRIMEDAY', type:'I', newPrice: "129", newCompletePrice: "229" }
];

let price = "179";
let completeprice = "279";

// Check if any coupon code is present in the query parameters and update the price
let foundCoupon = false;
let foundCompleteCoupon = false;
coupons.forEach(coupon => {
    if (coupon_code === coupon.code) {
        price = coupon.newPrice;

        if (coupon.newCompletePrice) {
          completeprice = coupon.newCompletePrice;
          foundCompleteCoupon = true;
        }
        foundCoupon = true;
    }
});

if (!foundCoupon) return;

price = price + "&nbsp;<s>$199</s>"

if (foundCompleteCoupon) {

  completeprice = completeprice + "&nbsp;<s>$299</s>";

}

if (coupon_code === "UDEMYSTUDENT") {
  price = price + "<b class='udemystudent'>Special Udemy Student Pricing</b>"
  completeprice = completeprice + "<b class='udemystudent'>Special Udemy Student Pricing</b>"
}


  // Replace the content
  const updatedPage1 = page.replace(regex1, "YesSetPrice");
  const updatedPage2 = updatedPage1.replace(regex2, price);
  const updatedPage3 = updatedPage2.replace(regex3, completeprice);
  return new Response(updatedPage3, response);
};