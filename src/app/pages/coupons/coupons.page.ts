import { Component, OnInit } from '@angular/core';
import {Coupon} from "../../models/coupon";
import {CouponsService} from "../../services/coupons.service";

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {

  public coupons: Coupon[];

  constructor(
    private couponService: CouponsService
  ) {
    this.coupons = [];
  }

  ngOnInit() {
    this.couponService.getCoupons().then((coupons: Coupon[]) => {
      this.coupons = coupons;
      console.log(this.coupons);
    })
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
  }
}
