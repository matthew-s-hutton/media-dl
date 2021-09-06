import { Component, OnInit } from '@angular/core';
import { SendMailService } from '../send-mail.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private sendMailService: SendMailService) { }

  userData = {
    mailAddress: "",
    mailSubject: "",
    mailBody: ""
  }

  ngOnInit(): void {
  }

  sendEmailWrapper() {
    if (
      this.userData.mailAddress &&
      this.userData.mailSubject &&
      this.userData.mailBody
    ) {
      let mailDataFormatted = {
        to: "EMAIL ADDRESS",
        subject: "Twitter DL Mail",
        text: "Email received from " + this.userData.mailAddress +
              "\n" + this.userData.mailBody
      }
      this.sendMailService.sendmail(mailDataFormatted).
      subscribe((data: any) => {
        if ('error' in data) {
          console.error(data.error);
        } else {
          console.log(data.info);
        }
      })
    } else {
      return
    }
  }
}
