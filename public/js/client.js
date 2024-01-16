import {
    create,
    get,
    parseCreationOptionsFromJSON,
    parseRequestOptionsFromJSON
} from "/scripts/@github/webauthn-json/dist/esm/webauthn-json.browser-ponyfill.js";

const app = $('#app');
const formPlace = $('#form-place');
const detailFormDiv = $('#detail-form');
let registerTemplate, signInTemplate, errorTemplate
let aboutTemplate, registerFormTemplate, signInFormTemplate
let factorsTemplate, challengesTemplate, detailFormTemplate

let pageToken = null;

const showError = (error) => {
    const message = error.message;
    const html = errorTemplate({color: 'orange', 'title': 'Error', 'message': message});
    app.html(html);
};

// Router Declaration
const router = new Router({
    mode: 'history',
    page404: (path) => {
        const html = errorTemplate({
            color: 'yellow',
            title: 'Error 404 - Page NOT Found!',
            message: `The path '/${path}' does not exist on this site`,
        });
        app.html(html);
    },
});

window.addEventListener('load', () => {
    // Compile Handlebar Templates
    errorTemplate = Handlebars.compile($('#error-template').html());
    registerTemplate = Handlebars.compile($('#factor-register-template').html());
    signInTemplate = Handlebars.compile($('#sign-in-template').html());
    aboutTemplate = Handlebars.compile($('#about-template').html());
    registerFormTemplate = Handlebars.compile($('#register-form-template').html());
    signInFormTemplate = Handlebars.compile($('#sign-in-form-template').html());

    Handlebars.registerPartial("factorsTableRow", $("#factor-row-template").html());
    Handlebars.registerPartial("challengesTableRow", $("#challenge-row-template").html());
    Handlebars.registerPartial("pageNav", $("#page-nav-template").html());
    factorsTemplate = Handlebars.compile($('#factors-template').html());
    challengesTemplate = Handlebars.compile($('#challenges-template').html());
    detailFormTemplate = Handlebars.compile($('#detail-form-template').html());

    initConfig();

    router.add('/', () => {
        let html = aboutTemplate();
        formPlace.html(html);
        // Remove loader status
        $('.loading').removeClass('loading');
    });

    router.add('/register', () => {
        let html = registerFormTemplate();
        formPlace.html(html);
        // Remove loader status
        $('.loading').removeClass('loading');
    });

    router.add('/sign-in', () => {
        let html = signInFormTemplate();
        formPlace.html(html);
        // Remove loader status
        $('.loading').removeClass('loading');
    });

    router.add('/factors', () => {
        listItems("factors", pageToken, factorsTemplate);
        pageToken = null;
    });

    router.add('/challenges', () => {
        listItems("challenges", pageToken, challengesTemplate);
        pageToken = null;
    });

    // Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');

    $('a').on('click', '.item', (event) => {
        // Block browser page load
        event.preventDefault();

        app.html("")

        const target = $(event.target);
        // Highlight Active Menu on Click
        $('.item').removeClass('active');
        target.addClass('active');

        // Navigate to clicked url
        const href = target.attr('href');
        router.navigateTo(href);
    });

});

const initConfig = () => {
    getPasskeys('/config')
        .then((configData) => {
            $('#account-sid').val(configData.accountSid);
            $('#service-sid').val(configData.serviceSid);
        })
        .catch((error) => {
            console.log(error);
            showError(error);
        }).finally(() => {
        $('.loading').removeClass('loading');
    });
}

$(document).on('click', '#config-submit', (event) => {
    event.preventDefault();

    let accountSid = $('#account-sid').val();
    let serviceSid = $('#service-sid').val();
    const configData = {accountSid, serviceSid};

    postPasskeys('/config', configData).catch((error) => {
        console.log(error);
        showError(error);
    }).finally(() => {
        $('.loading').removeClass('loading');
    });

})

$(document).on('click', '#registerButton', (event) => {
    event.preventDefault();
    let html = registerTemplate();
    app.html(html);

    let userName = $('#user-name').val()
    let userFriendlyName = $('#user-friendly-name').val()
    let userVerification = $('#user-verification').val()
    let authenticatorAttachment = $('#authenticator-attachment').val()

    let createFactorBody = {userName, userFriendlyName, userVerification, authenticatorAttachment}

    postPasskeys('/factors/create', createFactorBody
    ).then((factorData) => {
        return createKey(factorData.credentialCreationOptions)
    }).then((authenticatorAttestationResponse) => {
        let verifyBody = {userName, authenticatorAttestationResponse}
        return postPasskeys('/factors/verify', verifyBody)
    }).then((factorVerifyResponse) => {
        let data = {'credentials': JSON.stringify(factorVerifyResponse, null, 2)}
        html = registerTemplate(data);
        app.html(html);
    }).catch((error) => {
        console.log(error);
        showError(error);
    }).finally(() => {
        $('.loading').removeClass('loading');
    });
})

$(document).on('click', '#signInButton', (event) => {
    event.preventDefault();
    let html = signInTemplate();
    app.html(html);

    let userName = $('#user-name').val()
    let userFriendlyName = $('#user-friendly-name').val()
    let userVerification = $('#user-verification').val()

    let createChallengeBody = {userName, userFriendlyName, userVerification}

    postPasskeys('/challenges/create', createChallengeBody
    ).then((challengeData) => {
        return getKey(challengeData.credentialRequestOptions)
    }).then((authenticatorAssertionResponse) => {
        let verifyBody = {userName, authenticatorAttestationResponse: authenticatorAssertionResponse}
        return postPasskeys('/challenges/verify', verifyBody);
    }).then((challengeVerifyResponse) => {
        let data = {'credentials': JSON.stringify(challengeVerifyResponse, null, 2)}
        html = signInTemplate(data);
        app.html(html);
    }).catch((error) => {
        console.log(error);
        showError(error);
    }).finally(() => {
        $('.loading').removeClass('loading');
    });
})

$(document).on('click', '.center.aligned.item', (event) => {
    const target = $(event.target);
    const token = target.attr('data-value');
    if (token) {
        console.log("token = " + token);
        pageToken = token;
        router.navigateTo(window.location.pathname);
    }
})

//#form-place > div.ui.basic.segment.left.aligned > table > tbody > tr:nth-child(1) > td:nth-child(1) > a
$(document).on('click', 'table tbody tr td a', (event) => {
    event.preventDefault(); // prevent the default action
    const target = $(event.target);
    const sid = target.attr('href');
    const endpoint = target.attr('data-value');
    const header = endpoint === "factors" ? "Factor" : "Challenge";
    console.log("item sid " + sid + " endpoint " + endpoint);
    itemDetail(header, endpoint, sid);
});

const listItems = (endpoint, token, template) => {
    formPlace.html('');
    let params = {page_size: 10};
    if (token) {
        params.page_token = token;
    }
    getPasskeys('/' + endpoint + '/list', params).then((items) => {
        const html = template(items);
        formPlace.html(html);
    }).catch((error) => {
        console.log(error);
        showError(error);
    }).finally(() => {
        $('.loading').removeClass('loading');
    });
}

const itemDetail = (header, endpoint, sid) => {
    detailFormDiv.html('');
    getPasskeys('/' + endpoint + '/' + sid).then((item) => {
        const data = {
            header: header,
            text: JSON.stringify(item, null, 2)
        };
        const html = detailFormTemplate(data);
        detailFormDiv.html(html);
        $('#detail-form').modal('show')
    }).catch((error) => {
        console.log(error);
        showError(error);
    }).finally(() => {
        $('.loading').removeClass('loading');
    });
}

const postPasskeys = (path, body) => {
    let postRequest = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    return fetch(path, $.extend(true, postRequest, {body: JSON.stringify(body)}))
        .then((response) => {
            if (response.ok) {
                console.log('response from Verify Passkeys ' + JSON.stringify(response));
                return response.json();
            }
            return response.text().then((err) => {
                throw new Error("response from Verify Passkeys: " + err)
            });
        })
}

const getPasskeys = (path, params) => {
    let getRequest = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }
    if (params) {
        path = path + '?' + new URLSearchParams(params);
    }
    return fetch(path, getRequest)
        .then((response) => {
            if (response.ok) {
                console.log('response from Verify Passkeys ' + JSON.stringify(response));
                return response.json();
            }
            return response.text().then((err) => {
                throw new Error("response from Verify Passkeys: " + err)
            });
        })
}

const createKey = (publicKey) => {
    if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */
        throw new Error('PublicKeyCredential is not supported.');
    }
    console.log("createKey request")
    console.log(JSON.stringify(publicKey, null, 2))
    const credentialCreationOptions = parseCreationOptionsFromJSON(publicKey);
    return create(credentialCreationOptions).then(result => {
        console.log("createKey response");
        console.log(JSON.stringify(result, null, 2));
        return result;
    })
}

const getKey = (publicKey) => {
    if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */
        throw new Error('PublicKeyCredential is not supported.');
    }
    console.log("getKey request")
    console.log(JSON.stringify(publicKey, null, 2))
    const credentialRequestOptions = parseRequestOptionsFromJSON(publicKey);
    return get(credentialRequestOptions).then(result => {
        console.log("getKey response")
        console.log(JSON.stringify(result, null, 2));
        return result;
    });
}