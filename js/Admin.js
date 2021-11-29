import ExternalServices from "./externalServices.js";
import {
  alertMessage,
  qs,
  setSessionStorage,
  setClickforAll,
  getSessionStorage,
  setLocalStorage,
} from "./utils.js";

export default class Admin {
  constructor(identifier) {
    this.identifier = identifier;
    this.token = null;
    this.services = new ExternalServices();
    this.email = null;
    this.password = null;
    this.confirmPassword = null;
  }

  init() {
    qs(this.identifier).addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleClick();
    });
    setClickforAll(".fa-eye", (e) => this.showPassword(e));
  }

  async login(creds) {
    try {
      this.token = await this.services.loginRequest(creds);
      console.log(this.token);
      setSessionStorage("userToken", this.token);
      location.href = "/admin-dashboard.html";
    } catch (err) {
      console.log(err.message);
      alertMessage(err.message.error);
    }
  }

  async register(creds) {
    try {
      const message = await this.services.registerRequest(creds);
      console.log(message);
      setLocalStorage("alertMessage", `${message} You can log in now.`);
      location.href = "/login.html";
    } catch (err) {
      console.log(err.message.error[0].msg);
      alertMessage(err.message.error[0].msg);
    }
  }

  async handleClick() {
    this.email = qs("#email").value;
    this.password = qs("#password").value;

    switch (this.identifier) {
      case "#login":
        const creds = {
          email: this.email,
          password: this.password,
        };
        await this.login(creds);
        break;
      case "#register":
        this.confirmPassword = qs("#confirmPassword").value;
        if (this.password === this.confirmPassword) {
          const creds = {
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword,
          };
          await this.register(creds);
        } else {
          alertMessage("Please write the same password.");
        }

        break;
      default:
        break;
    }
    // const main = qs("main");
    // const alert = qs(".alert");

    // if (alert) {
    //   main.removeChild(alert);
    // }
  }

  showPassword(e) {
    const id = e.id;
    let password = "";
    switch (id) {
      case "password":
        password = document.querySelector("#password");
        break;
      case "confirmPassword":
        password = document.querySelector("#confirmPassword");
        break;
    }
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }
}
