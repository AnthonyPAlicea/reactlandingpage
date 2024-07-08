import { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  
  // Just return what was requested without transforming it, 
  // unless we fnd the coupon code query parameter
  const url = new URL(request.url);
  if (url.searchParams.get("coupon_code")) {
    return;
  }

  // Get the page content
  const response = await context.next();
  const page = await response.text();

  // Search for the placeholder
  const regex1 = /{{SET_PRICE}}/i;
  const regex2 = /{{PRICE}}/i;

  // Replace the content
  const price = "99";
  let updatedPage1 = page.replace(regex1, "YesSetPrice");
  let updatedPage2 = updatedPage1.replace(regex2, price);
  return new Response(updatedPage2, response);
};