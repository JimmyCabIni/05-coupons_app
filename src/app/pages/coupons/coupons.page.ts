import { Component, OnInit } from '@angular/core';
import {Coupon} from "../../models/coupon";
import {CouponsService} from "../../services/coupons.service";
import {NavController, NavParams} from "@ionic/angular";

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {

  public couponsActive: boolean
  public coupons: Coupon[];

  constructor(
    private couponService: CouponsService,
    private navParams: NavParams,
    private navController: NavController,
  ) {
    this.coupons = [];
    this.couponsActive = false;
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
}
