const { test, expect } = require('@playwright/test');

test('Admin Login API - Mindflix', async ({ request }) => {

  const response = await request.post('https://uat-admin.mindflix360.com/', {
    headers: {
      'accept': 'application/json, text/plain, */*',
      'content-type': 'application/json',
      'origin': 'https://uat-admin.mindflix360.com',
      'referer': 'https://uat-admin.mindflix360.com/',
      'user-agent': 'Mozilla/5.0',

      // 🔥 MOST IMPORTANT HEADERS
      'x-api-channel': 'web_admin_portal',
      'x-api-lang': 'en/US',
      'x-api-version': '1.0'
    },

    data: {
      digest_info: "NA",   // ✅ FIXED
      device_info: {
        name: "NA",
        manufacturer: "NA",
        model: "NA",
        version: "NA",
        os: "NA"
      },
      request_key: {
        request_type: "admin_portal_signin",
        request_id: "NA"
      },
      request_data: {
        UserId: "MINDFLIX.ADMIN1",
        Password: "Admin@123"
      }
    }
  });

  const body = await response.json();

  console.log(body);
  

  // ✅ Assertions
  expect(response.status()).toBe(200);
  expect(body.resp_info.resp_code).toBe("0");

});