$(document).ready(function () {

    /********************** Add to Calendar **********************/
    // var myCalendar = createCalendar({
    //     options: {
    //         class: '',
    //         // You can pass an ID. If you don't, one will be generated for you
    //         id: ''
    //     },
    //     data: {
    //         // Event title
    //         title: "Ram and Antara's Wedding",

    //         // Event start date
    //         start: new Date('Nov 27, 2017 10:00'),

    //         // Event duration (IN MINUTES)
    //         // duration: 120,

    //         // You can also choose to set an end time
    //         // If an end time is set, this will take precedence over duration
    //         end: new Date('Nov 29, 2017 00:00'),

    //         // Event Address
    //         address: 'ITC Fortune Park Hotel, Kolkata',

    //         // Event Description
    //         description: "We can't wait to see you on our big day. For any queries or issues, please contact Mr. Amit Roy at +91 9876543210."
    //     }
    // });

    // $('#add-to-cal').html(myCalendar);


    /********************** RSVP **********************/
    $('#rsvp-form').on('submit', function (e) {
        console.log("I AM IN FUNCTION")
        e.preventDefault();
        var data = $(this).serialize();
        console.log("I AM IN FUNCTION 2")
        $('#alert-wrapper').html(alert_markup('info', '<strong>Just a sec!</strong> We are saving your details.'));
        console.log("I AM IN FUNCTION 3")
        if (MD5($('#invite_code').val()) !== 'a73faabe9c920371836cf55b4e2bfa06'
            && MD5($('#invite_code').val()) !== 'a73faabe9c920371836cf55b4e2bfa06') {
            $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> Your invite code is incorrect.'));
        } else {
            console.log("I AM IN FUNCTION 4")
            $.post('https://script.google.com/macros/s/AKfycbwbh3p6ez3hBt2goQyKMziHXX_j1wVePGPCChoXeYcAOPAWrQ8zo-5bo0FrUZK1Qctc/exec', data)
                .done(function (data) {
                    console.log(data);
                    if (data.result === "error") {
                        $('#alert-wrapper').html(alert_markup('danger', data.message));
                    } else {
                        $('#alert-wrapper').html('');
                        $('#rsvp-modal').modal('show');
                    }
                })
                .fail(function (data) {
                    console.log(data);
                    $('#alert-wrapper').html(alert_markup('danger', '<strong>Sorry!</strong> There is some issue with the server. '));
                });
        }
    });

});
