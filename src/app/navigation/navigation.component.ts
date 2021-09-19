import { Component, OnInit, ElementRef, HostListener, Inject } from '@angular/core';
import { AppComponent } from '../app.component';
import { trigger, query, sequence, style, animate, transition } from '@angular/animations';
import { NavigationStart, Router } from '@angular/router';
import { Event as RouterEvent} from '@angular/router'
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('dropDown', [
      transition(':enter', [
        style({height: '0px'}),
        query('.narrow-list-item', [
          style({opacity: 0})
        ]),
        sequence([
          animate(200, style({height: '*'})),
          query('.narrow-list-item', [
            animate(400, style({opacity: 1}))
          ])
        ])
      ]),
      transition(':leave', [
        style({height: '*'}),
        query('.narrow-list-item', [
          style({opacity: 1})
        ]),
        sequence([
          query('.narrow-list-item', [
            animate(100, style({opacity: 0}))
          ]),
          animate(200, style({height: '0px'}))
        ])  
      ])
    ]),
  ]
})
export class NavigationComponent implements OnInit {

  constructor(private appComponent: AppComponent,
    private elementRef: ElementRef,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService,
    private tabTitle: Title) {
      this.tabTitle.setTitle("Twitter DL")
    }

  dropDownActive = false
  title = this.appComponent.title
  private destroyed$ = new Subject()

  menuItems = [
    {
      name: this.title, 
      link: 'dl', 
      router: true, 
      reactiveCompress: false
    }, {
      name: 'About', 
      link: 'about', 
      router: true, 
      reactiveCompress: true
    }, {
      name: 'Contact', 
      link: 'contact', 
      router: true, 
      reactiveCompress: true
    }, {
      name: 'Source Code', 
      link: 'https://github.com/matthew-s-hutton/media-dl', 
      router: false, 
      reactiveCompress: true
    }, {
      name: 'Report a Bug', 
      link: 'https://github.com/matthew-s-hutton/media-dl/issues', 
      router: false, 
      reactiveCompress: true
    }
  ]

  /**
   * Set up of this component includes:
   * - Setting the theme of the page based on a cookie
   * - Checking for a NavigationStart router event, and if found closing
   *   the dropdown menu.
   */
  ngOnInit(): void {
    if (this.cookieService.check('style')) {
      this.loadTheme(this.cookieService.get('style'));
    } else {
      this.loadTheme("light-styles.css");
    }
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.dropDownActive = false;
    })
  }

  /**
   * Checks to see if the user has clicked on any part of the page
   * apart from the navigation bar. If they have then close the dropdown
   * menu if it's open.
   * @param targetElement 
   */
  @HostListener('document:click', ['$event.target'])
  onPageClick(targetElement: Record<string, unknown>): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.dropDownActive = false;
    }
  }

  /**
   * Changes between dark and light themes, then sets a cookie with the chosen theme.
   * @param cssFile 
   */
  loadTheme(cssFile: string): void {
    const linkId = "light-dark-theme";
    const headElement = this.document.getElementsByTagName('head')[0];

    const existingLinkElement = this.document.getElementById(linkId) as HTMLLinkElement;
    if (existingLinkElement) {
      existingLinkElement.href = cssFile;
    } else {
      const newLinkElement = this.document.createElement('link');
      newLinkElement.id = linkId;
      newLinkElement.rel = "stylesheet";
      newLinkElement.href = cssFile;
      headElement.appendChild(newLinkElement);
    }
    this.cookieService.set('style', cssFile);
  }
}
