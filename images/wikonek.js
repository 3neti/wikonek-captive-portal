const fabian = '20331r1';
const dummyClientMACAddress = '37:60:06:07:73:40';
const dummyClientIPAddress = '123.123.123.123';
let device_mac_address = dummyClientMACAddress;
let device_ip_address = dummyClientIPAddress;

document.addEventListener('readystatechange', event => {
    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        // if (`$clientmac` !== "\$clientmac") {
        //     device_mac_address = `$clientmac`
        // }
        device_mac_address = `$clientmac`;
        device_ip_address = `$clientip`;
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...)
    if (event.target.readyState === "complete") {
        device_mac_address = `$clientmac`
        device_ip_address = `$clientip`;
    }
});
document.addEventListener('alpine:init', () => {
    Alpine.store('wikonek', {
        gatewayAddress: `$gwaddress`,
        gatewayPort: `$gwport`,
        deviceMACAddress: device_mac_address,
        deviceIPAddress: device_ip_address,
        stationMACAddress: `$gatewaymac`,
        coinExpiry: `$queueTime`,
        config: {
            notification: {
                delay: 3 * 1000,
                transitionOut: 1 * 1000,
            },
            splash: {
                image: splashURL,//TODO: put this back to splashURL, but have to tweak to load faster
                delay: 2 * 1000,
            },
            pinSize: 4,
            device: {
                defaultName: 'mobile',
            },
            // environment: 'testing',
            refreshInterval: 60 * 1000,
            flashTimeout: 3 * 1000,
            replenishThreshold: 5000,
            insertCoinThreshold: 0 * 100, //centavos for now, should be zero most of the time
            egressTimeout: 1 * 1000,
        },
        connection: {
            status: {
                get network() {
                    return navigator.onLine === true;
                },
                get gateway() {
                    return (testClientMACAddress !== Alpine.store('wikonek').deviceMACAddress);
                },
                internet: false,
                backend: false,
                maintenance: true,
            },
        },
        data: {
            touch: {
                token: '',
                day_pass_today: {
                    availed: 0
                },
                device: {
                    user: null,
                }
            },
            station: {
                identifier: '',//supposedly MAC address of station
                name: '',//station ID
                user: null, //manager of station
            },
            ui: {
                balance: {
                    load: {
                        amount: 5370.00,
                        units: 'pesos'
                    },
                    airtime: {
                        amount: 0,
                        units: 'minutes'
                    }
                },
                main: [

                ],
                navigation: [],
                products: [
                    {
                        code: '1HIA',
                        name: 'UNLI Data 1 Hour',
                        rate: '₱ 5.00'
                    }
                ],
                profile: {
                    mobile: '',
                    name: '',
                    birthdate: '',
                    address: '',
                    role: '',
                    verified: null
                },
                recipients: [],
                transactions: [],
                environment: 'production',
                device: {
                    identifier: ''
                },
                station: {
                    identifier: '',
                    name: '',
                    manager: null
                },
                settings: {
                    profileUpdateAirtime: 60
                }
            },
            purchase: {
                product: {
                    rate: '₱ 0.00',
                }
            },
            inspiration: `"To fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.” – Sun Tzu,`,
        },
        session: {
            loading: null,
            loaded: false,
            ui_interval_handle: null,
            airtime: 0,
            stashed: false,
            orphaned: null,
            get hasDeviceMACAddress() {
                // return this.deviceMACAddress !== "\$clientmac";
                return this.deviceMACAddress !== dummyClientMACAddress;
            },
            get token() {
                return Alpine.store('wikonek').data.touch.token;
            },
            get dayPassClaimed() {
                let retval = false;
                if (Alpine.store('wikonek').data.touch.day_pass_today) {
                    if (+Alpine.store('wikonek').data.touch.day_pass_today.availed > 0) {
                        retval = true;
                    }
                }

                return retval;
            },
            get gatewayURL() {
                let address = Alpine.store('wikonek').gatewayAddress
                let port = Alpine.store('wikonek').gatewayPort
                if (isEmpty(address) || address == "\$gwaddress") {
                    address = '10.10.10.1'
                }
                if (isEmpty(port) || port == "\$gwport") {
                    port = 80
                }
                return `http://${address}:${port}/`
            },
            get deviceMACAddress() {
                let retval = Alpine.store('wikonek').deviceMACAddress;
                if (retval === dummyClientMACAddress) {
                    if (Alpine.store('wikonek').data.ui.environment === 'testing') {
                        retval = testClientMACAddress;
                    }
                }

                return retval;
            },
            get deviceIPAddress() {
                let retval = Alpine.store('wikonek').deviceIPAddress;
                if (retval === dummyClientIPAddress) {
                    if (Alpine.store('wikonek').data.ui.environment === 'testing') {
                        retval = testClientIPAddress;
                    }
                }

                return retval;
            },
            get stationMACAddress() {
                let retval = Alpine.store('wikonek').stationMACAddress;
                if (retval.indexOf('gatewaymac') > 0) {
                    retval = virtualStationID;
                }

                return retval;
            },
            get registered() {
                return Iodine.isRequired(Alpine.store('wikonek').data.ui.profile.mobile);
            },
            get coinExpiry() {
                let retval = Alpine.store('wikonek').coinExpiry;
                if (retval === "\$queueTime") {
                    retval = 10;
                }

                return retval;
            },
            get hasProfile() {
                const profile = Alpine.store('wikonek').data.ui.profile
                return !isEmpty(profile.mobile)
                    && !isEmpty(profile.name)
                    && !isEmpty(profile.address)
                    && !isEmpty(profile.birthdate)
            },
        },
        html: {
            modalClose: `<svg class="h-7 w-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fill-rule="evenodd"/></svg>`,
        },
        ui: {
            manager: {
                get name() {
                    const station = Alpine.store('wikonek').data.ui.station
                    return !station ||  !station.manager || !station.manager.mobile || station.manager.name === station.manager.mobile
                        ? ''
                        : station.manager.name
                },
                get mobile() {
                    const station = Alpine.store('wikonek').data.ui.station
                    return !station ||  !station.manager || !station.manager.mobile
                        ? ''
                        : formatPhone(station.manager.mobile.replace(/^\+?63/, '0'))
                },
                get handle() {
                    return !this.name
                        ? !this.mobile ? '' : this.mobile
                        : `${this.name} ${this.mobile}`
                }
            },
        },
        get station() {
            return this.data.station;
        },
        loadValidations() {
            console.log('** store->wikonek->loadValidations()');
            Iodine.addRule(
                "regexFullName",
                (value) => Iodine.isRegexMatch(value, "(\\b[A-Za-z]+)( )([A-Za-z]+\\b)")
            );
            Iodine.messages.regexFullName = "Value must match [First Name] [Last Name]";
            console.log('** - regexFullName loaded');
            Iodine.addRule(
                "regexMobile",
                (value) => Iodine.isRegexMatch(value, "09\\d{2}\\s?\\d{3}\\s?\\d{4}$")
                // (value) => Iodine.isRegexMatch(value, "09\\d{9}$")
            );
            Iodine.messages.regexMobile = "Value must match 09## ### ####";
            console.log('** - regexMobile loaded');
            Iodine.addRule(
                "stringDate",
                (value) => Iodine.isDate(new Date(value))
            );
            Iodine.messages.stringDate = "Value must be a date";
            console.log('** - stringDate loaded');
            Iodine.addRule(
                "plausibleDate",
                (value) => moment(value).isBetween(moment().subtract(100,'years'), moment().subtract(6,'years'))
            )
            Iodine.messages.plausibleDate = "Value must be betweeen -100 years and -6 years from today";
            console.log('** - plausibleDate loaded');
            Iodine.addRule(
                "regexPIN",
                (value) => Iodine.isRegexMatch(value, `\\d{${this.config.pinSize}}$`)
            );
            Iodine.messages.regexPIN = "Value must match ####";
            console.log('** - regexPIN loaded');
            Iodine.addRule(
                "regexVoucher",
                (value) => Iodine.isRegexMatch(value, "^\\w{4}\\-?\\w{4}$")
            );
            Iodine.messages.regexVoucher = "Value must match ****-****";
            console.log('** - regexVoucher loaded');
            Iodine.addRule(
                "maskedNumber",
                (value) => ~~value.replace(/\D/g,'')>0
            );
            Iodine.messages.maskedNumber = "Value must be a positive number";
            console.log('** - positiveNumber loaded');
        },
        async api_touch() {
            console.log('** store->wikonek->api_touch()');
            this.session.loading = true;
            const device = this.session.deviceMACAddress;
            const device_name = this.config.device.defaultName;
            const url = apiEndPoint + `/touch/${device}/${device_name}`;
            await fetch(url, {method: 'POST'})
                .then(response => response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        console.log(`** - fetch touch`);
                        this.data.touch = obj.body.data;
                        console.log(this.data.touch, 'this.data.touch');
                    }
                    this.connection.status.maintenance = (obj.status == 503);
                    this.connection.status.internet = true;
                    this.connection.status.backend = obj.isOk;
                    this.session.orphaned = (obj.status == 424);
                })
                .catch(error => {
                    this.connection.status.internet = false;
                    console.log('** error caught in store->wikonek->api_touch()');
                })
                .finally(() => {
                    this.session.loaded = true;
                    this.session.loading = false;
                })
        },
        async api_station() {
            console.log('** store->wikonek->api_station()');
            const station = this.session.stationMACAddress;
            const url = apiEndPoint+`/stations/${station}`;
            console.log(url, 'fetch url');
            await fetch(url, {
                method: 'GET',
                headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        console.log('** - fetch station');
                        this.data.station = obj.body.data;
                        console.log(this.data.station, 'this.data.station');
                    }
                    this.connection.status.maintenance = (obj.status == 503);
                    this.connection.status.backend = obj.isOk;
                })
        },
        async api_ui() {
            console.log('** store->wikonek->api_ui()');
            const device = this.session.deviceMACAddress;
            const station = this.session.stationMACAddress;
            await fetch(apiEndPoint+`/ui/${device}/${station}`, {method: 'GET', headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}})
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        console.log('** - fetch ui');
                        this.data.ui = obj.body.data;
                        // this.registered = !isEmpty(this.data.ui.profile.mobile) || !isEmpty(this.user.mobile);
                        console.log(this.data.ui, 'this.data.ui');
                    }
                    else {
                        clearInterval(this.session.ui_interval_handle);
                    }
                    this.connection.status.maintenance = (obj.status == 503);
                    this.connection.status.backend = obj.isOk;
                })
                .catch(() => clearInterval(this.session.ui_interval_handle))
        },
        async api_consume(minutes = -1, all = false) {
            console.log('** store->wikonek->api_consume()');
            return await fetch(apiEndPoint+`/consume/${minutes}/${all}`, {method: 'POST', headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}})
                .then(response =>  response.json().then(data => (data.data)))
        },
        async api_extend(minutes) {
            console.log('*** store->wikonek->api_extend_airtime()')
            const seconds = minutes * 60
            const gatewayURL = Alpine.store('wikonek').session.gatewayURL
            return await fetch(gatewayURL+`control.html?timereete=${seconds}`, {method: 'GET'})
                .then(response =>  response.text().then(text => ({success: response.ok, action: console.log(text)})))
                .then(extension => extension.success ? minutes : 0)
        },
        async api_inspire() {
            console.log('** store->wikonek->api_inspire()');
            const url = apiEndPoint + `/inspire`;
            return await fetch(url, {method: 'GET'})
                .then(response => response.text())
                .then(inspiration => {this.data.inspiration = inspiration});
        },
        async api_stash(minutes) {
            console.log('** store->wikonek->api_stash()');
            return await fetch(apiEndPoint+`/stash/${minutes}`, {method: 'POST', headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}})
                .then(response => response.json())
                .then(() => {this.session.stashed = true;})
                .then(() => minutes)
        },
        async api_dissociate() {
            console.log(`# data->profile->api_dissociate()`);
            const device = Alpine.store('wikonek').session.deviceMACAddress;
            const url = apiEndPoint+`/dissociate/${device}`;
            console.log(`# - fetching ${url}`);
            return await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
            ;
        },//TODO: refactor
        ingress() {
            const gatewayURL = Alpine.store('wikonek').session.gatewayURL
            location.assign(gatewayURL)
        },
        egress(param1, param2, param3=landingURL) {
            let url = new URL(rootURL + `/egress`);
            url.searchParams.append('param1', param1);
            url.searchParams.append('param2', param2);
            url.searchParams.append('param3', param3);
            setTimeout( () => location.assign(url), this.config.egressTimeout);
        },
        boot() {
            this.loadValidations();
            this.api_touch()
                // .then(() => this.api_station())
                .then(() => {
                    this.api_ui()
                        .then(() => {
                            if (this.config.refreshInterval > 0) {
                                this.session.ui_interval_handle = setInterval(() => {this.api_ui()}, this.config.refreshInterval)
                            }
                        })
                })

                .finally(() => this.api_inspire());
        },
        init() {
            console.log('* store->wikonek->init()');
            setTimeout(() => {
                this.boot();
            }, 500);
        },
        // get mode() {
        //     return this.canManage ? SHOW_MANAGER : SHOW_USER;
        // },
        get modes() {
            let values = SHOW_USER;
            if (this.canManage) {
                values = values | SHOW_MANAGER;
            }
            // if (this.canAdminister) {
            //     values = values | SHOW_ADMIN;
            // }

            return values;
        },
        get canManage() {
            let retval = false;
            if (typeof this.data.ui.station.manager === 'object' && this.data.ui.station.manager !== null) {
                if (typeof this.data.touch.device.user === 'object' && this.data.touch.device.user !== null) {
                    if (this.data.ui.station.manager.id == this.data.touch.device.user.id) {
                        retval = true;
                    }
                }
            }

            return retval;
        },//TODO: this should be server-based
        get canAdminister() {
            return (this.data.ui.profile.role === 'agent');
        },
        unstash() {
            this.api_ui();
            const airtime = this.data.ui.balance.airtime.amount * 1;
            if (airtime > 0) {
                this.api_consume(airtime)
                    .then(() => this.api_extend(airtime))
                    .then(() => this.api_ui())
                    .then(() => {
                        this.session.stashed = false;
                    });
            }

            return airtime;
        },
    })
    Alpine.data('ui', () => ({
        device: {
            get macAddress() {
                return Alpine.store('wikonek').session.deviceMACAddress;
            },
            get ipAddress() {
                return Alpine.store('wikonek').session.deviceIPAddress;
            },
            get stationID() {
                return Alpine.store('wikonek').session.stationMACAddress;
            },
        },
        assets: {
            logo: {
                main: 'images/logo.png',
                manager: 'images/manager.png',
                pointer: 'images/pointer.png',
                agent: 'images/agent.png',
            }
        },
        get loading() {
            return Alpine.store('wikonek').session.loading;
        },
        get loaded() {
            return Alpine.store('wikonek').session.loaded;
        },
        get hasDeviceMACAddress() {
            return Alpine.store('wikonek').session.hasDeviceMACAddress;
        },
        get userVerified() {
            return Alpine.store('wikonek').data.ui.profile.verified
        },
        get userUnverified() {
            return !this.userVerified
        },
        get connected() {
            return Alpine.store('wikonek').connection.status.network
        },
        get disconnected() {
            return !this.connected
        },
        get accessible() {
            return Alpine.store('wikonek').connection.status.internet
        },
        get inaccessible() {
            return !this.accessible
        },
        get online() {
            return Alpine.store('wikonek').connection.status.backend;
        },
        get registered() {
            return Alpine.store('wikonek').session.registered
        },
        get unregistered() {
            return !this.registered
        },
        get underMaintenance() {
            return Alpine.store('wikonek').connection.status.maintenance
        },
        get notUnderMaintenance() {
            return !this.underMaintenance
        },
        get environment() {
            return Alpine.store('wikonek').data.ui.environment;
        },
        text: {
            errors: {
                deviceMACAddress: 'Cannot identify your device from this WiFi connection! Try our alternate SSID e.g. WiKONEK Orange or WiKONEK Blue.'
            },
        },
        init() {
            this.$nextTick(() => {
                if (this.hasDeviceMACAddress) {
                    this.$dispatch('notify', {
                            content: `Your MAC Address is ${this.device.macAddress}.`,
                            type: 'info'
                        }
                    );
                    // this.loaded = true;
                }
            });
            // if (this.hasDeviceMACAddress) {
            //     this.$nextTick(() => {
            //         this.$dispatch('notify', {
            //                 content: `Your MAC Address is ${this.device.macAddress}.`,
            //                 type: 'info'
            //             }
            //         );
            //     });
            //     this.loaded = true;
            // }
            // if (this.inaccessible) {
            //
            // }
        },
    }))
    Alpine.data('ingress', () => ({
        image: Alpine.store('wikonek').config.splash.image,
        delay: Alpine.store('wikonek').config.splash.delay, // in milliseconds
        init() {
            console.log(`# data->ingress->init()`);
            setTimeout(() => this.$el.classList.add('display-none'), this.delay);
            console.log(`# - setting splash delay to ${this.delay.toLocaleString()} ms`);
        }
    }))
    Alpine.data('registration', () => ({
        agreed: false,
        wantToLogin: false,
        fields: {
            mobile: {
                value: null,
                maxLength: 11,
                rules: ['required', 'regexMobile'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            pin: {
                value: null,
                maxLength: Alpine.store('wikonek').config.pinSize,
                rules: ["required", "regexPIN"],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            pin_confirmation: {
                value: null,
                maxLength: Alpine.store('wikonek').config.pinSize,
                rules: ['required', 'regexPIN', 'matchingPIN'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
        },
        captions: {
            get title() {
                return this.wantToLogin ? 'Sign Up' : 'Log In';
            },
            agreed: "Check here to indicate that you have read and agree to the terms of the LyfLyn.Net Customer Agreement.",
            get already() {
                return this.wantToLogin ? 'Uncheck to login.' : 'Check to register.'
            },
            button: 'Go!!!'
        },
        defaultPIN: '1234',
        registerMobileSucceeded: null,
        registerMobileFailed: null,
        get registered() {
            return Alpine.store('wikonek').session.registered;
        },
        get unregistered() {
            return !this.registered;
        },
        get canRegister() {
            return (
                this.fields.mobile.isValid && this.agreed
            );
        },
        get mayLogin() {
            return isEmpty(Alpine.store('wikonek').data.ui.profile.mobile);
        },
        get canLogin() {
            return this.mayLogin
                && !isEmpty(this.fields.mobile.value)
                && !isEmpty(this.fields.pin.value);
        },
        get wantToRegister() {
            return !this.wantToLogin;
        },
        set wantToRegister(value) {
            this.wantToLogin = !value;
        },
        get email() {
            const number = this.fields.mobile.value.substr(1);

            return `63${number}@libreng.email`;
        },
        get route() {
            return `/registration`;
        },
        clear() {
            Object.values(this.fields).forEach(field => {
                field.value = '';
                field.errorMsg = null;
            });
        },
        flagUnauthorized() {
            this.fields.mobile.isValid = false;
            this.fields.mobile.errorMsg = 'Wrong credentials';
            this.fields.pin.isValid = false;
            this.fields.pin.errorMsg = 'Wrong credentials';
            setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
            this.$dispatch('notify', { content: `Login failed! Please try again.`, type: 'error'});
        },
        flagDuplicateMobile() {
            this.fields.mobile.isValid = false;
            this.fields.mobile.errorMsg = 'Mobile number is already registered.';
            this.$dispatch('notify', { content: `Registration failed!`, type: 'error'});
            setTimeout(() => window.scrollTo(0,0), Alpine.store('wikonek').config.notification.delay)
        },
        register(args) {
            let token = null;
            if (args.isOk === true) {
                token = args.body;
                this.$dispatch('notify', {
                    content: `Your default PIN is 1234. Please change it soon.`,
                    type: 'success'});
            }
            else if (args.status === 401) {
                this.flagDuplicateMobile()
            }
            else if (args.status === 422) {
                this.flagDuplicateMobile()
            }

            return token;
        },
        login(args) {
            let token = null;
            if (args.isOk === true) {
                token = args.body;
                this.$dispatch('notify', { content: `Login successful!`, type: 'success'});
            }
            else if (args.status === 401) {
                this.flagUnauthorized();
            }
            else if (args.status === 422) {
                this.flagDuplicateMobile()
            }

            return token;
        },
        associate(user) {
            console.log(user, 'associate user');
            let retval = false;
            if (user) {
                this.$dispatch('notify', {
                    content: `This device is successfully registered to [${user.mobile}]`,
                    type: 'success'});
                retval = true;
            }

            return retval;
        },
        refresh() {
            Alpine.store('wikonek').api_touch()
                .then(() => Alpine.store('wikonek').api_ui());
        },
        init() {
            console.log(`# data->registration->init()`);
            Iodine.addRule(
                "matchingPIN",
                (value) => value === this.fields.pin.value
            );
            Iodine.messages.matchingPIN = "Value must match Security PIN";
            console.log('# - matchingPIN loaded');
            this.$watch('agreed', value => {
                if (value) {
                    this.$dispatch('notify', {
                        content: 'You have agreed to the terms of the LyfLyn.Net Customer Service Agreement.',
                        type: 'info'}
                    );
                }
            });
        },
        async api_register(token) {
            console.log('# data->registration->api_register()');
            const mobile = '63' + this.fields.mobile.value.substr(1);
            const pin = this.defaultPIN;
            console.log(mobile, 'mobile');
            return await fetch(apiEndPoint + `/mobile/${mobile}/${pin}`, {
                method: 'POST',
                headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(args => this.register(args))
                ;
        },
        async api_login() {
            console.log('# data->registration->api_login()');
            const credentials = JSON.stringify({
                email: this.email, //TODO: improve this!!!
                password: this.fields.pin.value,
                device_name: Alpine.store('wikonek').config.device.defaultName
            });
            return await fetch(apiEndPoint + `/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'text/plain'},
                body: `${credentials}`
            })
                .then(response => response.text().then(data => ({
                    status: response.status,
                    body: data,
                    isOk: response.ok
                })))
                .then(args => this.login(args))
        },
        async api_signup() {
            console.log('# data->registration->api_signup()')
            const credentials = JSON.stringify({
                mobile: this.fields.mobile.value
            })
            return await fetch(apiEndPoint + `/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Accept': 'text/plain'},
                body: `${credentials}`
            })
                .then(response => response.text().then(data => ({
                    status: response.status,
                    body: data,
                    isOk: response.ok
                })))
                .then(args => this.register(args))
        },
        async api_challenge(token) {
            console.log('# data->registration->api_challenge()')
            await fetch(apiEndPoint + `/challenge`, {method: 'POST', headers: {"Authorization": "Bearer "+ token}})
                .then(response =>  response.json().then(data => data.data))
            return token
        },
        async api_associate(token) {
            console.log('# data->registration->api_associate()');
            const device = Alpine.store('wikonek').session.deviceMACAddress;
            return await fetch(apiEndPoint + `/associate/${device}`, {method: 'POST', headers: {"Authorization": "Bearer "+ token}})
                .then(response =>  response.json().then(data => data.data))
                .then(data => this.associate(data.user))
        },
        validateFields() {
            this.fields.mobile.validate(validationCallback)
        },
        submit() {
            console.log('# data->registration->submit()');
            this.validateFields()
            if (this.wantToRegister) {
                this.api_signup()
                    .then(token => this.api_challenge(token))
                    .then(token => this.api_associate(token))
                    .then(success => success && this.refresh())
                // const token = Alpine.store('wikonek').session.token;
                // this.api_register(token)
                //     .then(success => success && this.refresh());
            }
            else if (this.wantToLogin) {
                this.api_login()
                    .then(token => this.api_associate(token))
                    .then(success => success && this.refresh())
            }
        },
    }))
    Alpine.data('otp', () => ({
        fields: {
            otp: {
                value: null,
                get label() {
                    mobile = formatPhone(Alpine.store('wikonek').data.ui.profile.mobile.replace(/^\+?63/, '0'))
                    return `Enter OTP sent via sms to ${mobile}.`
                },
                maxLength: Alpine.store('wikonek').config.pinSize,
                rules: ["regexPIN"],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this)
                    this.isValid = isValid
                    this.errorMsg = errorMsg
                },
                isValid: null,
                errorMsg: null
            }
        },
        captions: {
            title: 'Verify Mobile',
            button: 'Go!!!',
            resend: 'Resend One-Time PIN (OTP)',
            get logoff() {
                mobile = formatPhone(Alpine.store('wikonek').data.ui.profile.mobile.replace(/^\+?63/, '0'))
                return `Log-off ${mobile}`
            },
        },
        verifyMobileSucceeded: null,
        verifyMobileFailed: null,
        dissociateSubscriberSucceeded: null,
        dissociateSubscriberFailed: null,
        get verified() {
            return Alpine.store('wikonek').data.ui.profile.verified
        },
        clear() {
            Object.values(this.fields).forEach(field => {
                field.value = '';
                field.errorMsg = null;
            });
        },
        flagUnverified() {
            this.fields.otp.isValid = false;
            this.fields.otp.errorMsg = 'Invalid OTP!';
            setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
            this.$dispatch('notify', { content: `Verification failed! Please try again.`, type: 'error'});
        },
        flagUnkown() {
            this.fields.otp.isValid = false;
            this.fields.otp.errorMsg = 'Unknown error!';
            setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
            this.$dispatch('notify', { content: `Verification failed! Please try again.`, type: 'error'});
        },
        verify(args) {
            if (args.isOk === true) {
                this.$dispatch('notify', {
                    content: `Your mobile number is verified. Thank you.`,
                    type: 'success'});
            }
            else if (args.status === 406) {
                this.flagUnverified()
            }
            else {
                console.log(args, 'args')
                this.flagUnkown()
            }

            return args.isOk;
        },
        resend(args) {
            if (args.isOk === true) {
                this.$dispatch('notify', {
                    content: `Resending OTP..`,
                    type: 'success'});
            }
            else {
                this.flagUnkown()
            }

            return args.isOk;
        },
        refresh() {
            Alpine.store('wikonek').api_touch()
                .then(() => Alpine.store('wikonek').api_ui());
        },
        async api_verify() {
            console.log('# data->verification->api_verify()')
            const otp = this.fields.otp.value
            const url = apiEndPoint+`/verify/${otp}`
            return await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(args => this.verify(args))
            ;
        },
        async api_resend() {
            console.log('# data->verification->api_resend()')
            const url = apiEndPoint+`/challenge`
            return await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(args => this.resend(args))
                ;
        },
        untouch() {
            Alpine.store('wikonek').api_dissociate()
                .then(() => Alpine.store('wikonek').ingress())//TODO: get obj.Ok response
                .then(() => Alpine.store('wikonek').api_ui())
        },
        validateField() {
            this.fields.otp.validate(validationCallback)
        },
        submit() {
            console.log('# data->verification->submit()');
            this.validateField()
            this.api_verify()
                .then(success => success && this.refresh())
        },
    }))
    Alpine.data('about', () => ({
        open: false,
        title: 'About',
        caption: 'Go!!!',
        info: [
            { id: 1, label: 'Station ID', value: Alpine.store('wikonek').data.ui.station.name},
            { id: 2, label: 'Device MAC Address', value: Alpine.store('wikonek').session.deviceMACAddress},
            { id: 3, label: 'Device IP Address', value: Alpine.store('wikonek').session.deviceIPAddress},
            { id: 4, label: 'Station MAC Address', value: formatMACAddress(Alpine.store('wikonek').session.stationMACAddress)},
            { id: 5, label: 'Attached Mobile Phone', value: formatPhone(Alpine.store('wikonek').data.ui.profile.mobile.replace(/^\+?63/, '0'))},
            { id: 6, label: 'Tindera', value: Alpine.store('wikonek').ui.manager.handle},
            { id: 7, label: 'Environment', value: Alpine.store('wikonek').data.ui.environment},
            { id: 8, label: 'Release ID', value: fabian},
            { id: 9, label: 'Server', value: getCookie("wikonek.server")},
        ],
        submit() {
            if (this.canUpdate) {
                this.api_profile()
                    .then(() => this.extend())
                    .then(() => Alpine.store('wikonek').api_ui())
            }
            this.clear()
        },
    }))
    Alpine.data('profile', () => ({
        open: false,
        title: 'Update Profile',
        caption: 'Go!!!',
        fields: {
            name: {
                value: null,
                maxLength: 50,
                rules: ['required', 'regexFullName'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            mobile: {
                value: null,
                maxLength: 11,
                rules: ['required', 'regexMobile'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            birthdate: {
                value: null,
                rules: ["required", "stringDate", "plausibleDate"],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            address: {
                value: null,
                maxLength: 200,
                rules: ["required"],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
        },
        updateProfileSucceeded: false,
        updateProfileFailed: false,
        extended: false,
        canUpdate() {
            return this.fields.mobile.isValid && this.fields.name.isValid && this.fields.birthdate.isValid && this.fields.address.isValid
        },
        get extension() {
            let extension = Alpine.store('wikonek').data.ui.settings.profileUpdateAirtime
            if ( Alpine.store('wikonek').session.hasProfile )
                extension = 0
            return extension
        },
        get extensionMessage() {
            const extension = formatDuration(Alpine.store('wikonek').data.ui.settings.profileUpdateAirtime)
            return `Thank you for providing your details. We are extending your airtime by ${extension}.`
        },
        set profile(profile) {
            const mobile = profile.mobile.replace(/^\+?63/, '0')
            this.fields.mobile.value = mobile
            this.fields.name.value = profile.name === profile.mobile ? '' : profile.name
            this.fields.birthdate.value = moment(Alpine.store('wikonek').data.ui.profile.birthdate, 'DD/MM/YY').format('YYYY-MM-DD')
            this.fields.address.value = profile.address
        },
        get profile() {
            return {
                name: this.fields.name.value,
                mobile: this.fields.mobile.value,
                birthdate: this.fields.birthdate.value,
                address: this.fields.address.value
            }
        },
        async api_profile() {
            console.log(`# data->profile->api_profile()`);
            const url = apiEndPoint+`/profile/${this.profile.mobile}/${this.profile.name}/${this.profile.birthdate}/${this.profile.address}`;
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        this.updateProfileSucceeded = true;
                    }
                })
            ;
        },
        extend() {
            const airtime = this.extension
            if ( airtime > 0 ) {
                Alpine.store('wikonek').api_extend(airtime)
                this.extended = true;
                setTimeout(() => {
                    this.open = false
                    this.extended = false
                }, Alpine.store('wikonek').config.flashTimeout)
            }
        },
        clear() {
            this.updateProfileSucceeded = false
            this.updateProfileFailed = false
        },
        submit() {
            if (this.canUpdate) {
                this.api_profile()
                    .then(() => this.extend())
                    .then(() => Alpine.store('wikonek').api_ui())
            }
            this.clear()
        },
    }))
    Alpine.data('password', () => ({
        open: false,
        title: 'Change PIN',
        caption: 'Go!!!',
        fields: {
            old_pin: {
                value: null,
                maxLength: Alpine.store('wikonek').config.pinSize,
                rules: ["required", "regexPIN"],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            pin: {
                value: null,
                maxLength: Alpine.store('wikonek').config.pinSize,
                rules: ["required", "regexPIN"],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            pin_confirmation: {
                value: null,
                maxLength: Alpine.store('wikonek').config.pinSize,
                rules: ['required', 'regexPIN', 'matchPIN'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
        },
        name: null,
        mobile: null,
        updatePasswordSucceeded: false,
        updatePasswordFailed: false,
        init() {
            Iodine.addRule(
                "matchPIN",
                (value) => value === this.fields.pin.value
            );
            Iodine.messages.matchPIN = "PIN confirmation needs to match PIN";
        },
        canUpdate() {
            return this.fields.old_pin.isValid && this.fields.pin.isValid && this.fields.pin_confirmation.isValid;
        },
        clear() {
            console.log('clearing profile');
            this.fields.old_pin.value = '';
            this.fields.old_pin.errorMsg = '';
            this.fields.pin.value = '';
            this.fields.pin.errorMsg = '';
            this.fields.pin_confirmation.value = '';
            this.fields.pin_confirmation.errorMsg = '';
            this.updatePasswordSucceeded = null;
            this.updatePasswordFailed = null;
        },
        set profile(profile) {
            this.mobile = profile.mobile
            this.name = profile.name
        },
        get profile() {
            return {
                name: this.name,
                mobile: this.mobile
            }
        },
        async api_password() {
            console.log(`# data->password->api_password()`);
            const url = apiEndPoint+`/password/${this.fields.old_pin.value}/${this.fields.pin.value}`;
            console.log(`# - fetching ${url}`);
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        this.updatePasswordSucceeded = true;
                    }
                    else if (obj.status === 401) {
                        this.fields.old_pin.isValid = false;
                        this.fields.old_pin.errorMsg = 'Wrong PIN';
                        this.updatePasswordFailed = true;
                    }
                })
                .finally(() => {
                    setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
                })
            ;
        },
        submit() {
            if (this.canUpdate) {
                this.api_password()
            }
        },
    }))
    Alpine.data('dashboard', () => ({
        wallet: 'load',
        captions: {
            balance: 'Wallet Balance',
            claim: 'Claim your free internet.',//deprecate
            claimed: 'You already claimed your FREE internet for the day',//deprecate
            replenish: 'Please add funds to your wallet balance soon.',
            get button1() {
                let caption = 'Free Airtime'
                if (Alpine.store('wikonek').session.hasProfile)
                    caption = 'Update Profile'

                return caption
            }
        },
        dissociateSubscriberSucceeded: false,//TODO: link to ui
        dissociateSubscriberFailed: false,//TODO: link to ui
        get hasProfile() {
            return Alpine.store('wikonek').session.hasProfile
        },
        get replenishThreshold() {
            return Alpine.store('wikonek').config.replenishThreshold;
        },
        get replenish() {
            return true;
            return (Alpine.store('wikonek').data.ui.balance.load.amount * 1) < this.replenishThreshold;
        },
        // get loadRemaining() {
        //     return (Alpine.store('wikonek').data.ui.balance.load.amount * 1).toLocaleString();
        //     // return this.remaining('load');
        // },
        remaining(wallet) {
            let retval = '';
            switch (wallet) {
                case 'load':
                    // retval = (Alpine.store('wikonek').data.ui.balance.load.amount * 1).toLocaleString();
                    // retval += ' ';
                    // retval += Alpine.store('wikonek').data.ui.balance.load.units;
                    retval = formatCurrency(Alpine.store('wikonek').data.ui.balance.load.amount);
                    break;
                case 'airtime':
                    // retval = (Alpine.store('wikonek').data.ui.balance.airtime.amount * 1).toLocaleString();
                    // retval += ' ';
                    // retval += Alpine.store('wikonek').data.ui.balance.airtime.units;
                    retval = formatDuration(Alpine.store('wikonek').data.ui.balance.airtime.amount, Alpine.store('wikonek').data.ui.balance.airtime.units);
                    break;
            }

            return retval;
        },
        get stationID() {
            return Alpine.store('wikonek').data.ui.station.name;
        },
        get manager() {
            return Alpine.store('wikonek').data.ui.station.user;
        },
        get canManage() {
            return Alpine.store('wikonek').canManage;
            // return this.manager !== null;
        },
        get canInsertCoin() {
            let retval = true;
            if (this.manager) {
                if (this.manager.wallets[0].balance <= Alpine.store('wikonek').config.insertCoinThreshold) {
                    retval = false;
                }
            }

            return retval;
        },
        get noInsertCoin() {
            return Iodine.isRegexMatch(this.stationID, "--$")
        },
        willUse: true,
        willManage: false,
        role: SHOW_USER,
        get isUser() {
            return !this.isManager;
            // return this.willUse;
        },
        get isManager() {
            return Alpine.store('wikonek').canManage && this.willManage;
        },
        get canAdminister() {
            return Alpine.store('wikonek').canAdminister;
        },
        toggleRoles() {
            // let i=0;
            // let roles = Alpine.store('wikonek').roles;
            // return function() {
            //     i = ++i % roles.length;
            //     this.role = roles[i];
            // }
            this.willManage = !this.willManage;
        },
        toggleWallets() {
            if (this.wallet === 'load')
                this.wallet = 'airtime';
            else
                this.wallet = 'load';
        },
        profile() {
            this.$dispatch('open-profile-modal');
        },
        redeem() {
            this.$dispatch('open-redeem-modal');
        },
        transfer() {
            this.$dispatch('open-transfer-modal', {transferee: {name: '', mobile: '', amount: ''}});
        },
        async api_dissociate() {
            console.log(`# data->profile->api_dissociate()`);
            const device = Alpine.store('wikonek').session.deviceMACAddress;
            const url = apiEndPoint+`/dissociate/${device}`;
            console.log(`# - fetching ${url}`);
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        this.dissociateSubscriberSucceeded = true;
                    }
                    else {
                        this.dissociateSubscriberFailed = true;
                    }
                })
            ;
        },
        dissociate() {
            this.api_dissociate()
                .then(() => Alpine.store('wikonek').ingress())
                .then(() => Alpine.store('wikonek').api_ui())
        },
        unstash() {
            const airtime = Alpine.store('wikonek').unstash();
            if (airtime > 0)
                this.$dispatch('notify', {
                    content: `You have unstashed ${airtime} minutes.`,
                    type: 'info'}
                );
        },
        stash() {
            const airtime = Math.round(Alpine.store('wikonek').session.airtime/60);
            Alpine.store('wikonek').api_stash(airtime)
                .then(minutes => Alpine.store('wikonek').api_extend(minutes * -1))
                .then(() => setTimeout(() => Alpine.store('wikonek').api_ui(), 100));
            // .then(() => Alpine.store('wikonek').api_ui());
        },
        init() {
            setTimeout(() => this.unstash(), 500)
        },
    }))
    Alpine.data('airtime', () => ({
        // code: '',
        get code() {
            let retval = Alpine.store('wikonek').session.airtime;
            if (Alpine.store('wikonek').session.stashed === true) {
                retval = Alpine.store('wikonek').data.ui.balance.airtime.amount * 60;
            }

            return retval;
        },
        set code(value) {
            Alpine.store('wikonek').session.airtime = value;
        },
        caption: 'Airtime',
        handle: null,
        get days() {
            return Math.floor(this.code / 86400)
        },
        get hours() {
            return Math.floor((this.code % 86400) / 3600)
        },
        get minutes() {
            return Math.floor(((this.code % 86400) % 3600) / 60)
        },
        get seconds() {
            return ((this.code % 86400) % 3600) % 60;
        },
        get timeRemaining() {
            return `${this.days}:${pad(this.hours, 2)}:${pad(this.minutes, 2)}.${pad(this.seconds, 2)}`
        },
        init() {
            console.log(`# data->airtime->init()`);
            if (Alpine.store('wikonek').connection.status.gateway === true) {
                this.api_ctime();
            }
            else {
                console.log('# - no airtime');
            }
        },
        api_ctime() {
            console.log(`# data->airtime->api_ctime()`);
            const url = '/pesofi_ctime/';
            const interval = 1000;
            this.handle = setInterval(() => {
                fetch(url, {method: 'GET'})
                    .then(response =>  response.text().then(data => ({status: response.status, body: data, isOk: response.ok})))
                    .then(obj => {
                        if (obj.isOk === true) {
                            this.code = parseRemainingTime(obj.body);
                        }
                        else if (obj.status === 404) {
                            console.log(`# - not connected to a WiKONEK access point. stopping....`);
                            clearTimeout(this.handle);
                        }
                        else {
                            console.log(`# - something else is wrong`);
                        }
                    })
            }, interval);
        },
        reset() {
            console.log(`# data->airtime->reset()`);
            clearTimeout(this.handle);
            this.api_ctime();
        }
    }))
    Alpine.data('checkin', () => ({
        checkin: null,
        get claimed() {
            return Alpine.store('wikonek').session.dayPassClaimed
        },
        get hasAirtime() {
            return Alpine.store('wikonek').session.airtime > 0;
        },
        get hasStash() {
            return Alpine.store('wikonek').session.stashed && Alpine.store('wikonek').data.ui.balance.airtime.amount > 0
        },
        get unclaimed() {
            return ! this.claimed;
        },
        get profileUpdateAirtime() {
            return formatDuration(Alpine.store('wikonek').data.ui.settings.profileUpdateAirtime)
        },
        get dayPassAirtime() {
            return formatDuration(Alpine.store('wikonek').data.ui.freebies.dayPass.features.airtime)
        },
        get checkinCaption() {
            return this.hasAirtime
                ? 'Click here to surf the internet.'
                : this.hasNoProfile
                    ? `Click here to update your profile and enjoy ${this.profileUpdateAirtime} of WiKONEK-tion!`
                    : this.hasStash
                        ? 'If you are staying in this station, click here to continue.'
                        : this.unclaimed
                            ? `Click here to claim your free ${this.dayPassAirtime} daily WiKONEK-tion!`
                            : 'Buy minutes to enjoy WiKONEK-tion.'
                ;
        },
        get inspiration() {
            return Alpine.store('wikonek').data.inspiration
        },
        get hasNoProfile() {
            return !Alpine.store('wikonek').session.hasProfile
        },
        hydrate(data) {
            this.checkin = data
        },
        consume(airtime) {
            return Alpine.store('wikonek').api_consume(airtime)
        },
        extend(consumption) {
            setTimeout(() => {Alpine.store('wikonek').api_extend(consumption.minutes)}, 500);
            this.extension = consumption.minutes;

            return consumption.minutes;
        },
        notify(minutes) {
            this.$dispatch('notify', { content: `${minutes} minutes airtime extension`, type: 'info'});
        },
        refresh() {
            Alpine.store('wikonek').api_touch();// TODO: deprecate, put day_pass_today in api_ui
            Alpine.store('wikonek').api_ui();
        },
        async api_checkin() {
            console.log(`## data->checkin->api_checkin()`);
            const device = Alpine.store('wikonek').session.deviceMACAddress;
            const station = Alpine.store('wikonek').session.stationMACAddress;
            await fetch(apiEndPoint+`/checkin/${device}/${station}`, { method: 'POST', headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}})
                .then(response =>  response.json().then(data => ({airtime: data.data, success: response.ok, action: this.hydrate(data.data)})))
                .then(checkin => checkin.success ? checkin.airtime: {airtime: 0})
                .then(data => this.consume(data.airtime))
                .then(extension => this.extend(extension))
                .then(minutes => this.notify(minutes))
                .then(() => this.refresh())
        },
        update() {
            return Alpine.store('wikonek').api_ui()
        },
        surf() {
            const param1 = this.inspiration;
            const param2 = '';
            const param3 = sponsorURL;
            Alpine.store('wikonek').egress(param1, param2, param3);
        },
        egress() {
            const param1 = `Complimentary ${this.checkin.airtime} minutes`;
            const param2 = this.checkin.splash;
            const param3 = this.checkin.url_landing;
            Alpine.store('wikonek').egress(param1, param2, param3);
        },
        promos() {
            // const param1 = 'Eat';
            // const param2 = 'Bulaga!';
            // const param3 = gatewayURL;
            // Alpine.store('wikonek').egress(param1, param2, param3);
            Alpine.store('wikonek').api_ui();
        },
        submit() {
            console.log(`# data->checkin->submit()`);
            if (this.hasAirtime) {
                this.surf()
            }
            else if (this.hasNoProfile) {
                this.$dispatch('open-profile-modal')
            }
            else if (this.hasStash) {
                Alpine.store('wikonek').unstash()
            }
            else if (this.unclaimed) {
                this.api_checkin()
                    .then(() => this.update())
                    .then(() => this.egress())
            }
            else {
                this.promos()
            }
        }
    }))
    Alpine.data('count', () => ({
        ticks: null,
        armHandle: null,
        statusHandle: null,
        armed: false,
        get disarmed() {
            return ! this.armed;
        },
        coins: [],
        get count() {
            return this.cumulative.length;
        },
        previous: 0,
        cumulative: 0,
        get amount() {
            return '₱ ' + this.cumulative + '.00';
        },
        get caption() {
            let retval = 'Insert Coin';
            if (this.armed) {
                if (this.cumulative > 0) {
                    retval = 'Go!!!';
                }
                else {
                    retval = 'Stop!'
                }
            }

            return retval;
        },
        get minutes() {
            return Math.floor(((this.ticks % 86400) % 3600) / 60)
        },
        get seconds() {
            return ((this.ticks % 86400) % 3600) % 60;
        },
        get timeRemaining() {
            return `${pad(this.minutes, 2)}:${pad(this.seconds, 2)}`
        },
        set coinsInserted(value) {
            if (value > 0) {
                if (value != this.cumulative) {
                    let coin = value - this.cumulative
                    this.coins.push(coin)
                    this.previous = coin
                    this.cumulative = value
                    console.log(`cumulative ${this.cumulative}`)
                    console.log(`coins ${this.coins}`)
                }
            }
        },
        get coinsInserted() {
            return this.coins;
        },
        init() {
            console.log('# data->count->init()');
            this.reset();
        },
        arm() {
            console.log('# data->count->arm()');
            const interval = 1000;
            this.armed = true;
            this.reset();
            this.armHandle = setInterval(() => {
                this.ticks--;
                this.check();
            }, interval);
            this.api_arm();
        },
        check() {
            console.log('# data->count->check()');
            if (this.ticks <= 0) {
                this.disarm();
            }
        },
        disarm() {
            console.log('# data->count->disarm()');
            this.armed = false;
            clearTimeout(this.armHandle);
            clearTimeout(this.statusHandle)
            this.api_done();
        },
        reset() {
            console.log('# data->count->reset()');
            this.coinsInserted = 0;
            this.ticks = Alpine.store('wikonek').session.coinExpiry;
            // this.ticks = Alpine.store('wikonek').config.coins.expiry;
        },
        toggle() {
            console.log('# data->count->toggle()');
            this.armed ? this.disarm() : this.arm();
        },
        api_arm() {
            console.log('# data->count->api_arm()');
            const url = '/pesofi_armcoinslot/';
            console.log(`# fetch-> ${url}`);
            fetch(url, {method: 'GET'}).then(() => {
                this.api_status()}
            )
        },
        api_status() {
            console.log('# data->count->api_status()');
            const url = `/pesofi_statuscoinslot/`;
            console.log(`# data.coin.api_status() fetch-> ${url}`);
            this.statusHandle = setInterval(() => {
                fetch(url, {method: 'GET'})
                    .then(response => response.text())
                    .then(str => {
                        this.coinsInserted = parseCoinsInserted(str);
                    })
            }, 500);
        },
        report_coins() {
            console.log('# data->count->report_coins()');
            if (this.coins.length > 0) {
                this.api_count()
            }
        },
        egress() {
            const param1 = `₱${this.cumulative}.00`;
            const param2 = Alpine.store('wikonek').data.inspiration;
            Alpine.store('wikonek').egress(param1, param2);
        },
        async api_count() {
            console.log('# data->count->api_count()');
            const device = Alpine.store('wikonek').session.deviceMACAddress;
            const station = Alpine.store('wikonek').session.stationMACAddress;
            const comma_delimited_coins = this.coins.toString();
            const url = apiEndPoint+`/count/${device}/${station}/${comma_delimited_coins}`;
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        console.log(`# - count successful`);
                    }
                })
        },
        api_done() {
            const url = '/pesofi_donecoinslot/';
            console.log(`# data.coin.api_done() fetch-> ${url}`);
            fetch(url, {method: 'GET'})
                .then(() => {
                    this.report_coins()
                })
                .then(() => {
                    if (this.cumulative > 0) {
                        this.egress();
                        // this.$dispatch('open-landing-count-modal', {cumulative: this.cumulative});
                        this.cumulative = 0;
                        this.ticks = 0;
                    }
                })
        }
    }))
    Alpine.data('redeem', () => ({
        fields: {
            voucher: {
                value: null,
                maxLength: 9,
                rules: ['required', 'regexVoucher'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
        },
        redemptionSucceeded: null,
        redemptionFailed: null,
        redemption: null,
        clear() {
            console.log('clearing redemption');
            this.fields.voucher.value = '';
            this.fields.voucher.errorMsg = '';
            this.redemptionSucceeded = null;
            this.redemptionFailed = null;
        },
        get caption() {
            return 'Go!!!';
        },
        get message() {
            let param1 = '';
            if (this.redemption) {
                param1 = 'You just redeemed ';
                if (this.redemption.airtime > 0 && this.redemption.load > 0) {
                    param1 = param1 + `${this.redemption.airtime} minutes & ₱${this.redemption.load/100}.00.`;
                }
                else if (this.redemption.airtime > 0) {
                    param1 = param1 + `${this.redemption.airtime} minutes.`;
                }
                else {
                    param1 = param1 + `₱${this.redemption.load/100}.00.`;
                }
            }

            return param1;
        },
        get canRedeem() {
            return this.fields.voucher.isValid
        },
        async api_redeem() {
            console.log(`# data->redeem->api_redeem()`);
            const voucher = formatVoucher(this.fields.voucher.value);
            const authorization = Alpine.store('wikonek').authorization;
            const url = apiEndPoint+`/redeem/${voucher}`;;
            console.log(`# - using voucher code ${voucher}`);
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    let redemption_data = {airtime: 0};
                    if (obj.isOk === true) {
                        console.log(`# - voucher redemption successful`);
                        redemption_data = obj.body.data;
                        console.log(redemption_data, 'redemption');
                    }
                    else if (obj.status === 404) {
                        console.log(`# - voucher code is invalid`);
                        this.fields.voucher.isValid = false;
                        console.log(obj.body.message, `# - displaying error message`);
                        this.fields.voucher.errorMsg = 'Voucher Code is not valid.';
                    }
                    else if (obj.status === 406) {
                        console.log(`# - voucher code is used`);
                        this.fields.voucher.isValid = false;
                        console.log(obj.body.message, `# - displaying error message`);
                        this.fields.voucher.errorMsg = 'Voucher Code is already used.';
                    }
                    else {
                        console.log(`# - general exception`);
                        this.fields.voucher.isValid = false;
                        console.log(`# - displaying error message`);
                        this.fields.voucher.errorMsg = 'Unknown error.';
                    }
                    this.redemptionSucceeded = obj.isOk;
                    this.redemptionFailed = !obj.isOk;

                    return redemption_data;
                })
                .then(redemption_data => {
                    this.redemption = redemption_data;
                    this.airtime = redemption_data.airtime;
                    // if (this.airtime > 0) {
                    if (this.redemption.airtime > 0) {
                        console.log('consuming redemption airtime');
                        // Alpine.store('wikonek').api_consume(this.airtime)
                        Alpine.store('wikonek').api_consume(this.redemption.airtime)
                            .then((consumption) => Alpine.store('wikonek').api_extend(consumption.minutes))
                            .then(() => Alpine.store('wikonek').api_ui());
                    }
                    // this.load = redemption_data.load / 100; //TODO: change this to loadFloat in the server
                    // this.url_landing = redemption_data.url_landing;
                })
                .finally(() => {
                    console.log('# - clearing flash messages');
                    setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
                })
            ;
        },
        egress() {
            const param1 = this.message;
            const param2 = `${this.redemption.voucher.data.message} - ${this.redemption.voucher.data.from}`;
            const param3 = this.redemption.url_landing;
            Alpine.store('wikonek').egress(param1, param2, param3);
        },
        submit() {
            if (this.canRedeem) {
                this.api_redeem().then(() => this.egress());
            }
        },
        done() {
            if (this.airtime > 0) {
                location.replace(this.redemption.url_landing);
            }
        }//TODO: deprecate
    }))
    Alpine.data('transfer', () => ({
        fields: {
            mobile: {
                value: null,
                maxLength: 11,
                rules: ['required', 'regexMobile'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
            amount: {
                value: null,
                maxLength: 8,
                rules: ['required', 'numeric', 'min:5'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null
            },
        },
        transferSucceeded: null,
        transferFailed: null,
        recipients: Alpine.store('wikonek').data.ui.recipients,
        get caption() {
            return'Go!!!'
        },
        get mobile() {
            return this.fields.amount.value
                ? formatPhone(this.fields.mobile.value)
                : ''
        },
        get amount() {
            // return `₱${this.fields.amount.value}.00`;
            return formatCurrency(this.fields.amount.value)
        },
        get message() {
            return `${this.amount} successfully transferred to ${this.mobile}.`
        },
        get minimumRemittance() {
            return 5.00;
        },
        get canTransfer() {
            return this.fields.mobile.isValid && this.fields.amount.isValid && this.fields.amount.value >= this.minimumRemittance;
        },
        clear() {
            console.log('clearing transfer');
            if (this.transferSucceeded || !this.fields.mobile.isValid) {
                this.fields.mobile.value = '';
                this.fields.mobile.isValid = null;
                this.fields.mobile.errorMsg = null;
            }
            if (this.transferSucceeded || !this.fields.amount.isValid) {
                this.fields.amount.value = null;
                this.fields.amount.isValid = null;
                this.fields.amount.errorMsg = null;
            }
            this.transferSucceeded = null;
            this.transferFailed = null;
        },
        validate() {
            this.fields.mobile.validate(validationCallback);
            this.fields.amount.validate(validationCallback);
        },
        async api_transfer() {
            console.log(`# data->transfer->api_transfer()`);
            const url = apiEndPoint+`/transfer/${this.fields.mobile.value}/${this.fields.amount.value}`;
            console.log(`# - fetching ${url}`);
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        console.log(`# - successful`);
                        console.log(`# - setting UI`);
                        Alpine.store('wikonek').api_ui();
                    }
                    else if (obj.status === 404) {
                        console.log(`# - mobile number does not exist`);
                        this.fields.mobile.isValid = false;
                        console.log(`# - displaying error message`);
                        this.fields.mobile.errorMsg = 'Mobile number does not exist.';
                    }
                    else if (obj.status === 406) {
                        console.log(`# - insufficient funds`);
                        this.fields.amount.isValid = false;
                        console.log(`# - displaying error message`);
                        this.fields.amount.errorMsg = 'Insufficient funds.';
                    }
                    this.transferSucceeded = obj.isOk;
                    this.transferFailed = !obj.isOk;
                })
                .finally(() => {
                    console.log('# - finally');
                    setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
                })
            ;
        },
        submit() {
            if (this.canTransfer) {
                this.api_transfer().then(() => {Alpine.store('wikonek').api_ui()});
                window.scrollTo(0,0);
            }
        }
    }))
    Alpine.data('purchase', () => ({
        purchaseSucceeded: null,
        purchaseFailed: null,
        selectedProduct: null,
        get title() {
            return 'Product Bundles';
        },
        get caption() {
            return'Go!!!'
        },
        get minimumSpend() {
            return 5.00;
        },
        get canBuy() {
            return +Alpine.store('wikonek').data.ui.balance.load.amount >= this.minimumSpend;
        },
        get products() {
            return Alpine.store('wikonek').data.ui.products
        },
        price(code) {
            const product = this.products.find(n => n.code == code);
            return parseProductRate(product.rate)
        },
        confirm(code) {
            console.log(`# data->purchase->confirm()`);
            console.log(this.selectedProduct, 'confirm selectedProduct');
            this.$dispatch('open-confirm-purchase-modal', { product: this.products.find(n => n.code == code) });
        },
        egress (code) {
            console.log(`# data->purchase->egress()`);
            const product = this.products.find(n => n.code == code);
            const param1 = product.name;
            const param2 = product.rate;
            Alpine.store('wikonek').egress(param1, param2);
        },
        async api_purchase(code) {
            console.log(`# data->purchase->api_purchase()`);
            const product = this.products.find(n => n.code == code)
            console.log(product, 'product to purchase');
            const url = apiEndPoint+`/purchase/${product.code}`;
            this.purchaseSucceeded = null;
            this.purchaseFailed = null;
            await fetch(url, {
                method: 'POST',
                headers: {"Authorization": "Bearer "+ Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    const purchase_data = obj.body.data;
                    if (obj.isOk === true) {
                        console.log(`# - purchase successful`);
                        Alpine.store('wikonek').data.purchase = purchase_data;
                    }
                    this.purchaseSucceeded = obj.isOk;
                    this.purchaseFailed = !obj.isOk;

                    console.log(purchase_data, 'purchase data');
                    return purchase_data;
                })
                .then(purchase_data => {
                    if (purchase_data.airtime > 0) {
                        Alpine.store('wikonek').api_consume(purchase_data.airtime)
                            .then((consumption) => Alpine.store('wikonek').api_extend(consumption.minutes))
                            .then(() => {Alpine.store('wikonek').api_ui(); window.scrollTo(0,0)});
                    }
                })
        },
        submit(code) {
            console.log(`# data->purchase->submit(code)`);
            this.api_purchase(code)
                .then(() => this.egress(code));
        },
    }))
    Alpine.data('admin', () => ({
        open: false,
        title: 'Setup Station',
        caption: 'Go!!!',
        fields: {
            name: {
                value: null,
                maxLength: 50,
                rules: ['required'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null,
                label: "Station ID",
                placeholder: "e.g. Aling Petra's Sari-Sari Store"
            },
            mobile: {
                value: null,
                maxLength: 11,
                rules: ['required', 'regexMobile'],
                validate(callback) {
                    let {isValid, errorMsg} = callback(this);
                    this.isValid = isValid;
                    this.errorMsg = errorMsg;
                },
                isValid: null,
                errorMsg: null,
                label: "Mobile Number [Tindera]",
                placeholder: "09xxxxxxxxx e.g. 09123456789"
            },

        },
        updateStationSucceeded: false,
        updateStationFailed: false,
        canUpdate() {
            return this.fields.mobile.isValid && this.fields.name.isValid;
        },
        clear() {
            console.log(`# data->profile->clear()`);
            this.fields.mobile.value = '';
            this.fields.mobile.errorMsg = '';
            this.fields.name.value = '';
            this.fields.name.errorMsg = '';
            this.updateStationSucceeded = null;
            this.updateStationFailed = null;
        },
        set station(value) {
            this.fields.name.value = value.name
            if (value.user) {
                const mobile = value.manager.mobile
                this.fields.mobile.value = mobile ? mobile.replace('+63', '0') : null
            }
        },
        async api_pair_station() {
            console.log(`# data->profile->api_station()`);
            const station = Alpine.store('wikonek').session.stationMACAddress;
            const user = this.fields.mobile.value;
            const name = this.fields.name.value;
            await fetch(apiEndPoint+`/administer/${station}/${user}/${name}`, {
                method: 'POST',
                headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        this.updateStationSucceeded = true;
                    }
                    else {
                        this.updateStationFailed = true;
                        setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
                    }
                })
            ;
        },
        async api_update_station() {
            console.log(`# data->profile->api_update_station()`);
            const station = Alpine.store('wikonek').session.stationMACAddress;
            const name = this.fields.name.value;
            const url = apiEndPoint+`/stations/${station}?name=${name}`;
            console.log(`# - fetching ${url}`);
            await fetch(url, {
                method: 'PUT',
                headers: {"Authorization": "Bearer " + Alpine.store('wikonek').session.token}
            })
                .then(response =>  response.json().then(data => ({status: response.status, body: data, isOk: response.ok})))
                .then(obj => {
                    if (obj.isOk === true) {
                        this.updateStationSucceeded = true;
                    }
                    else {
                        this.updateStationFailed = true;
                        setTimeout(() => this.clear(), Alpine.store('wikonek').config.flashTimeout);
                    }
                })
            ;
        },
        submit() {
            console.log(`# data->admin->submit()`);
            if (this.canUpdate) {
                this.api_pair_station()
                    // .then(() => this.api_update_station())
                    // .then(() => Alpine.store('wikonek').api_station())
                    .then(() => Alpine.store('wikonek').api_ui());
            }
        },
    }))
})

// const gatewayURL = `http://10.10.10.1:80/`;
// const gatewayURL = `http://$gwaddress:$gwport/`;
const protocol = getCookie('wikonek.protocol', 'https');
// const backendIPAddress = `206.189.90.222`;
// const backendIPAddress = `wikonek.test`;
// const backendIPAddress = `139.59.107.184`;
const backendIPAddress = getCookie('wikonek.server', 'wikonek.site');
const rootURL = `${protocol}://${backendIPAddress}`;
const splashURL = `${protocol}://${backendIPAddress}/splash`;
const sponsorURL = 'https://wikonek.ph';
const lguURL = `${protocol}://${backendIPAddress}/lgu`; // image of government sponsor
const landingURL = `${protocol}://${backendIPAddress}/landing`;
const apiEndPoint = `${protocol}://${backendIPAddress}/api`;
const egressEndPoint = `${protocol}://${backendIPAddress}/egress/checkin`
const testClientMACAddress = '31:88:05:53:76:63';
const testClientIPAddress = '31.88.00.210';
const virtualStationID = 'virtual';
const SHOW_USER = 0x1;
const SHOW_MANAGER = 0x2;
const SHOW_ADMIN = 0x3;
function validationCallback(field) {
    let {value, rules} = field;
    let isValid = Iodine.isValid(value, rules);
    let errorMsg = isValid
        ? null
        : Iodine.getErrorMessage(Iodine.is(value, rules));

    return {isValid, errorMsg};
}
function isEmpty(str) {
    return str === undefined || str === null
        || typeof str !== 'string'
        || str.match(/^ *$/) !== null;
}
function parseRemainingTime(str) {
    return str.substring(str.lastIndexOf('t') + 1, str.lastIndexOf('p'));
}
function parseCoinsInserted(str) {
    return str.substring(str.indexOf('parent.coin=') + 12, str.indexOf(';'));
}//refactor this, place it upstairs
function parseProductRate(str) {
    return +str.substring(str.lastIndexOf('₱')+1)
}//refactor this, place it upstairs
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
function formatPhone(mobile) {
    return mobile
        .replace(/\D/g,"")
        .replace(/^(\d{4})(\d{3})(\d{4})$/g, '($1) $2-$3')
}
function formatCurrency(number) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
    });

    return formatter.format(number);
}
function formatVoucher(code) {
    return code
        .replace(/^(\w{4})(\w{4})$/g, '$1-$2')
}
function formatDuration(value, units = 'minutes') {
    return value > 0
        ? moment.duration(value, units).humanize()
        : '0 minutes'
}
function formatMACAddress(value) {
    return value
        .toLowerCase()
        .replace(/^(\w{2})(\w{2})(\w{2})(\w{2})(\w{2})(\w{2})$/g, '$1:$2:$3:$4:$5:$6')
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname, cdefault="") {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return cdefault;
}
function setProtocol() {
    prot = prompt("Please enter the protocol:", getCookie("wikonek.protocol"));
    if (prot != "" && prot != null) {
        setCookie("wikonek.protocol", prot, 365);
    }
}
function checkProtocol() {
    let prot = getCookie("wikonek.protocol");
    if (prot != "") {
        alert("Protocol: " + prot);
    } else {
        prot = prompt("Please enter the protocol:", protocol);
        if (prot != "" && prot != null) {
            setCookie("wikonek.protocol", prot, 365);
        }
    }
}
function setServer() {
    server = prompt("Please enter the backend server:", getCookie("wikonek.server"));
    if (server != "" && server != null) {
        setCookie("wikonek.server", server, 365);
    }
}
function checkServer() {
    let server = getCookie("wikonek.server");
    if (server != "") {
        alert("Backend Server: " + server);
    } else {
        server = prompt("Please enter the backend server:", backendIPAddress);
        if (server != "" && server != null) {
            setCookie("wikonek.server", server, 365);
        }
    }
}