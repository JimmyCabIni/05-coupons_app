import { Component, OnInit } from '@angular/core';
import {NavParams} from "@ionic/angular";

@Component({
  selector: 'app-card-coupon',
  templateUrl: './card-coupon.page.html',
  styleUrls: ['./card-coupon.page.scss'],
})
export class CardCouponPage implements OnInit {

  constructor(
    private navParams: NavParams,
  ) {
    console.log(this.navParams.data['coupons']);
  }

  ngOnInit() {
  }

}
