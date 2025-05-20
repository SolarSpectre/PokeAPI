import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.platform.ready();
  }

  async initializeApp() {
    try {
      await this.platform.ready();
      if (this.platform.is('android')) {
        await StatusBar.setBackgroundColor({ color: '#3880ff' });
        await StatusBar.setStyle({ style: Style.Dark });
      }
      await SplashScreen.hide();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}
