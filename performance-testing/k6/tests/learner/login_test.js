import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';


const students = new SharedArray(
    'students',
    function () {

        return open('../../data/students.csv')
            .split('\n')
            .slice(1)
            .map(line => {

                let data = line.split(',');

                return {
                    email: data[0],
                    password: data[1]
                };

            });

    }
);

export const options = {

    vus: 23,
    iterations: 23

};

// export const options = {

//     stages:[
//         {
//             duration:'1m',
//             target:100
//         },
//         {
//             duration:'5m',
//             target:500
//         },
//         {
//             duration:'2m',
//             target:1000
//         }
//     ]

// };



export default function () {


    // Each virtual user gets different student

    let student = students[__VU - 1];


    let response = http.post(

        'https://demo.api.academy.mindflix360.com/',

        JSON.stringify({

            digest_info: "NA",

            device_info: {
                name: "NA",
                manufacturer: "NA",
                model: "NA",
                version: "NA",
                os: "NA"
            },

            request_data: {

                user_id: student.email,
                password: student.password

            },

            request_key: {

                request_type: "lms_student_user_login",
                request_id: "NA"

            }

        }),

        {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer null',
                'x-api-channel': 'web_client_portal',
                'x-api-lang': 'en/US',
                'x-api-version': '1.0'
            }

        }

    );


    check(response, {

        'login success':
            (r) => r.status === 200

    });

    // Console logs

    console.log(
        "VU:",
        __VU,
        "User:",
        student.email,
        "Status:",
        response.status
    );


    console.log(
        "Response Body:",
        response.body
    );


    check(response, {

        'login success':
            (r) => r.status === 200

    });


}