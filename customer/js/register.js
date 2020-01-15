let vm = new Vue({
    el: '#app',
    data: {
        error_name: false,
        error_password: false,
        error_check_password: false,
        error_email: false,
        error_phone: false,
        error_allow: false,
        error_sms_code: false,

        username: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        sms_code: '',
        allow: false,

        content: '发送验证码',  // 按钮里显示的内容
        totalTime: 60,     //记录具体倒计时时间
        canClick: true  //按钮是否能点击
    },
    methods: {
        check_username: function () {
            let len = this.username.length;
            this.error_name = len === 0;
        },
        check_pwd: function () {
            let len = this.password.length;
            this.error_password = len < 8 || len > 20;
        },
        check_cpwd: function () {
            this.error_check_password = this.password !== this.password2;
        },
        check_email: function () {
            let re = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            this.error_email = !re.test(this.email);
        },
        check_phone: function () {
            let re = /^1[3456789]\d{9}$/;
            this.error_phone = !re.test(this.phone);
        },
        check_sms_code: function () {
            this.error_sms_code = !this.sms_code;
        },
        check_allow: function () {
            this.error_allow = !this.allow;
        },
        countDown() {
            if (!this.canClick) return;
            this.canClick = false;
            this.content = this.totalTime + 's后重新发送';
            let clock = window.setInterval(() => {
                this.totalTime--;
                this.content = this.totalTime + 's后重新发送';
                if (this.totalTime < 0) {
                    window.clearInterval(clock);
                    this.content = '重新发送验证码';
                    this.totalTime = 60;
                    this.canClick = true;
                }
            }, 1000)
        },

        //获取短信验证码
        get_sms_code: function () {
            let that = this;
            axios.post("http://localhost:8080/YouMall/user/code.do", {
                "phoneNumbers": that.phone
            })
                .then(function (response) {
                    if (response.data.data === "phoneHaveExist") {
                        alert("该手机号已经注册!请换一个手机号注册");
                    }
                }).catch(error => console.log(error));
            that.countDown();
        },

        //注册
        on_submit: function () {
            let that = this;
            that.check_username();
            that.check_pwd();
            that.check_cpwd();
            that.check_email();
            that.check_phone();
            that.check_sms_code();
            that.check_allow();

            if (that.error_name || that.error_password || that.error_check_password || that.error_email || that.error_phone || that.error_allow || that.error_sms_code) {
                alert("请完整并正确填写信息");
            } else {
                axios.post("http://localhost:8080/YouMall/user/register.do", {
                    user: {
                        userName: that.username,
                        userPassword: that.password,
                        userPhone: that.phone,
                        userEmail: that.email,
                    },
                    code: that.sms_code
                })
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data !== null || response.data !== "") {
                            alert("注册成功!");
                            window.location.href = "login.html";
                        }else{
                            alert("验证码错误，请重试！");
                        }
                    }).catch(error => console.log(error));
            }
        }
    }
});
