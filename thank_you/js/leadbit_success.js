(function () {
    'use strict';
    var LBS = function () {

        this.initEvents();

        /**
         * Дефолтные параметры
         * @type {object }
         */
        this.params = {
            leadBitDomain: 'http://lea' + 'dbit.biz/',
            currentUrl: document.location.hostname,
            previousPage: document.referer,
            getToExtend: ['cb', 'fblp', 'lp', 'fbsop']


        };

        //Получаем Facebook ID
        var data = {
            page: this.params.currentUrl,
            callback: 'LeadBitSuccess.setData'
        };
        this.extendWithGet(this.params.getToExtend, data);
        //Отправляем TID на случай отсутствия кук
        if (this.queryGET('TID')) {
            data['TID'] = this.queryGET('TID');
        }
        $.ajax({
            url: this.params.leadBitDomain + "success-page",
            data: data,
            contentType: "application/json",
            jsonpCallback: "LeadBitSuccess.setData",
            dataType: "jsonp"
        });
    };

    LBS.prototype = {

        initEvents: function () {
            $('#email_form').on('submit', $.proxy(this.submitMail, this))
        },

        setData: function (data) {

            //Check FB pixel
            if (data && data.facebookPixelCodeId) {
                LeadBitSuccess.insertFbId.call(LeadBitSuccess, data);
            }

            //Check GooglePixel
            if (data && data.googleTagId) {
                LeadBitSuccess.insertGoogleTag.call(LeadBitSuccess, data.googleTagId);
            }

            //Check GoogleAnalytics
            if (data && data.googleAnalyticsId) {
                LeadBitSuccess.insertGoogleAnalytics.call(LeadBitSuccess, data.googleAnalyticsId);
            }
            //Check iFrame
            if (data && data.iframeUrl) {
                LeadBitSuccess.insertIframe.call(LeadBitSuccess, data.iframeUrl);
            }
            //Check propeller ads
            if (data && data.PropellerAdsImgPixelSuccess) {
                LeadBitSuccess.insertPropellerImg.call(LeadBitSuccess, data.PropellerAdsImgPixelSuccess);
            }
            if (data && data.PropellerAdsIframePixel) {
                LeadBitSuccess.insertPropellerIframe.call(LeadBitSuccess, data.PropellerAdsIframePixel);
            }
        },

        /**
         * Расширение массива во 2 аргументе
         * @param params - геты, которые надо добавить в запрос
         * @param array - массив с данными
         * @returns {*}
         */
        extendWithGet: function (params, array) {
            console.log(params, array);
            for (var i = 0; i < params.length; i++) {
                var param = this.queryGET(params[i]);
                param ? array[params[i]] = param : false;
            }
            console.log(array);
            return array;
        },

        /**
         * Получаем GET параметр из URL
         * @param  {String} name Имя параметра
         * @return {String}
         */
        queryGET: function (name) {
            if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
                return name[1] ? decodeURIComponent(name[1]) : 0;
        },

        /**
         * Отправляем e-mail и TID на leadbit
         * @param event
         * @returns {boolean}
         */
        submitMail: function (event) {
            console.log(event.currentTarget);
            var $form = $(event.currentTarget),
                email = $form.find('input[name=email]').val().replace(/^s+|s+$/g, ''),
                tid = this.getTid(),
                successText = $form.find('.btn-save').attr('data-success'),
                errorText = $form.find('.btn-save').attr('data-error');

            if (($(event.currentTarget).find('input[name=email]').val().length > 5) && (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+[a-z]{2,4}$/i).test(email)) {
                $.ajax({
                    type: "POST",
                    dataType: 'jsonp',
                    url: this.params.leadBitDomain + 'api/save-email-from-success-page',
                    data: {
                        email: email,
                        TID: tid
                    }
                }).done(function (response, status) {
                    console.log(response, status)
                });

                $('#email_form').html('<p>' + successText + '</p>');
                return false;
            }
            else {
                alert(errorText);
                return false;
            }
        },
        /**
         * Получаем TID
         * @returns {string}
         */
        getTid: function () {
            var regex = new RegExp("[\\?\\&]TID=([0-9A-Z]+)"),
                results = regex.exec(location.search);
            return results === null ? "" : results[1];
        },

        /**
         * Вставляем facebook id
         * @data  {object} data Facebook pixel id
         * @return void
         */
        insertFbId: function (data) {
            var fbScript = "<!-- Facebook Pixel Code --> <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '" + data.facebookPixelCodeId + "');fbq('track', 'PageView');fbq('track', 'Lead');</script><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=" + data.facebookPixelCodeId + "&ev=PageView&noscript=1'/>";
            document.body.insertAdjacentHTML('beforeend', fbScript);
            !function (f, b, e, v, n, t, s) {
                if (f.fbq)return;
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', data.facebookPixelCodeId);
            fbq('track', 'Lead');
        },

        /**
         * Вставляем google tag
         * @tagId  {int} google tag id
         * @return void
         */
        insertGoogleTag: function (tagId) {
            var googleScript = "<noscript><iframe src='//www.googletagmanager.com/ns.html?id=" + tagId + "' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript> <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','" + tagId + "');</script>";
            document.body.insertAdjacentHTML('beforeend', googleScript);
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', tagId);
        },

        /**
         * Вставляем google analitycs id
         * @tagId  {int} google analitycs id
         * @return void
         */
        insertGoogleAnalytics: function (tagId) {
            var googleAnalitycs = "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', '" + tagId + "', 'auto');ga('send', 'pageview');</script>";
            document.body.insertAdjacentHTML('beforeend', googleAnalitycs);
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            ga('create', tagId, 'auto');
            ga('send', 'pageview');
        },

        /**
         * Вставляем iFrame
         * @iframeUrl  {string} iframeUrl
         * @return void
         */
        insertIframe: function (iframeUrl) {
            var iframe = '<iframe style="position: absolute;left:-9999px;" width="1" scrolling="no" height="1" frameborder="0" src="' + iframeUrl + '" seamless="seamless">';
            document.body.insertAdjacentHTML('beforeend', iframe);
        },

        insertPropellerImg: function (imgSrc) {
            var img = '<img src="' + imgSrc + '" frameborder="0" width="1" height="1"/>';
            document.body.insertAdjacentHTML('beforeend', img);
        },

        insertPropellerIframe: function (iframeUrl) {
            var iframe = '<iframe src="' + iframeUrl + '" style="width:0;height:0;visibility:hidden;"></iframe>';
            document.body.insertAdjacentHTML('beforeend', iframe);
        }
    };

    $(function () {
        window.LeadBitSuccess = new LBS();
    })
})();
