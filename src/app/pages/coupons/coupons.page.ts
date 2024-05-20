import { Component, OnInit } from '@angular/core';
import {Coupon} from "../../models/coupon";
import {CouponsService} from "../../services/coupons.service";
import {AlertController, NavController, NavParams} from "@ionic/angular";
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {

  public couponsActive: boolean;
  public showCamera: boolean;
  public coupons: Coupon[];

  constructor(
    private couponService: CouponsService,
    private navParams: NavParams,
    private navController: NavController,
    private alertController: AlertController,
    private toasService: ToastService
  ) {
    this.coupons = [];
    this.couponsActive = false;
    this.showCamera = false;
  }

  ngOnInit() {
    this.couponService.getCoupons().then((coupons: Coupon[]) => {
      this.coupons = coupons;
      console.log(this.coupons);
    })
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponsActive = this.coupons.some(c => c.active);
  }

  goToCard() {
    this.navParams.data["coupons"] = this.coupons.filter(coupon => coupon.active);
    this.navController.navigateForward('card-coupon')
  }

  async startCamera() {
    this.showCamera = true;

    const granted = await this.requestPermissions();
    if (!granted) {
      const alert = await this.alertController.create({
        message: 'Esta app necesita permisos en la cámara para funcionar',
        buttons: ['OK']
      });
      await alert.present();

    }else {
      this.showCamera = true;

      try {
        const result = await BarcodeScanner.scan();

        if (result.barcodes.length > 0) {
          console.log(result); // Log the raw scanned content

          try {
            const coupon: Coupon = JSON.parse(result.barcodes[0].displayValue);

            if (this.isCouponValid(coupon)) {
              await this.toasService.showToast('QR escaneado correctamente');
              this.coupons.push(coupon);
            } else {
              await this.toasService.showToast('QR ERROR');
            }
          } catch (error) {
            await this.toasService.showToast('QR ERROR');
            console.log(error);
          }
        }
        this.closeCamera();
      } catch (error) {
        console.error('Error during barcode scanning:', error);
        await this.toasService.showToast('Error al escanear el QR');
        this.closeCamera();
      }
    }

  }


  closeCamera() {
    this.showCamera = false;
    BarcodeScanner.stopScan()
  }

  private isCouponValid(coupon: Coupon) {
    return coupon && coupon.id_product && coupon.img && coupon.name
  }


  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
}
