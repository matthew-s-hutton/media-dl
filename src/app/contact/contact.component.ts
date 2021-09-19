import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { trigger, style, animate, transition } from '@angular/animations';
import { ContactData } from 'src/models/contact-data';
import { SendMailService } from '../send-mail.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [
    trigger('dropDown', [
      transition(':enter', [ style({top: '0px'}), animate(200, style({top: "35px"}))]),
      transition(':leave', [ style({top: '35px'}), animate(200, style({top: "0px"}))])
    ]),
  ]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup

  constructor(private sendMailService: SendMailService,
    private formBuilder: FormBuilder) {
    this.contactForm = this.createFormGroup(this.formBuilder);
  }

  contactFormErr = ""
  contactFormSent = false

  ngOnInit(): void {
    // Empty
  }

  /**
   * This method creates a FormGroup for the email contact form.
   * @param formBuilder 
   * @returns 
   */
  createFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      contactData: formBuilder.group(new ContactData())
    });
  }

  /**
   * Used to call the {@link SendMailService | send email service}.
   * @returns 
   */
  sendEmailWrapper(): undefined {
    const mailData: ContactData = Object.assign(
      {}, this.contactForm.value.contactData
    );
    if (
      mailData.mailAddress &&
      mailData.mailSubject &&
      mailData.mailBody
    ) {
      this.contactFormErr = "";
      const mailDataFormatted = {
        to: "up739898@myport.ac.uk",
        subject: `Twitter-DL Mail: ${mailData.mailSubject}`,
        text: "Email received from " +
        mailData.mailAddress +
        "\n" + mailData.mailBody
      };
      this.sendMailService.sendmail(mailDataFormatted).
      subscribe((data: any) => {
        if ('error' in data) {
          this.contactFormErr = "Something went wrong!"
        } else {
          this.contactFormSent = true;
          console.log(data.info);
        }
      })
    } else {
      this.contactFormErr = "Missing field in contact form.";
      return;
    }
    return;
  }

    /**
   * Simply used to log errors.
   * @param err 
   */
     logError(err: string): void {
      if (err) {
        console.error(err);
      }
    }

    /**
     * Wait 5 seconds and make the email sent message disappear.
     */
    infoDropDownDisappear(): void {
      setTimeout(() => {
        this.contactFormSent = false; 
      }
      ,5000);
    }
}