import Link from "next/link";
import React from "react";
import styles from './FooterSection.module.css';

const FooterSection = () => {
  return (
    <footer className="tf__footer mt_100">
      <div className="tf__footer_overlay pt_75">
        <div className="container">
          <div className="row justify-content-between g-4">
            <div className="col-xl-3 col-sm-10 col-md-7 col-lg-6">
              <div className="tf__footer_logo_area">
                <Link className="footer_logo" href="/">
                
                </Link>
                <p>
                Գրասենյակային կահույք My Office-ի կողմից
                </p>
                <ul className="d-flex flex-wrap">
                  <li>
                    <a href="https://www.facebook.com/myofficefurniturearm?locale=hy_AM" target="_blank">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/myoffice_furniture/" target="_blank">
                    <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="/#" target="_blank">
                    <i className="fa-solid fa-list"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/+37460810810" target="_blank">
                    <i className="fa-brands fa-whatsapp"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/+37460810810" target="_blank">
                    <i className="fa-brands fa-telegram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={`col-xl-2 col-sm-10 col-md-5 col-lg-5 ${styles.footerServiceListCol}`}>
              <div className="tf__footer_content xs_mt_50">
                <h3>Ընտրեք ծառայությունը</h3>
                <ul>
                  <li>
                    <Link href="/furniture">Սեղաններ և աթոռներ</Link>
                  </li>
                  <li>
                    <Link href="/softfurniture">Փափուկ կահույք</Link>
                  </li>
                  <li>
                    <Link href="/windows">Պահարաններ և ավելին</Link>
                  </li>
                  <li>
                    <Link href="/other">Այլ</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-sm-10 col-md-7 col-lg-col-lg-6" style={{ marginLeft: '10px' }}>
              <div className="tf__footer_content xs_mt_30">
                <h3>Կապ մեզ հետ</h3>
                <p>Արգավանդ, Մայրաքաղաքային փ․ 89</p>
                <p>
                  <span> Phone: <Link href='tel: 060 810 810'>060 810 810</Link></span>
                </p>
                <p>
                  <span>Email: <Link href='mailTo: myofficearmenia@gmail.com'>myofficearmenia@gmail.com</Link> </span>
                  <span>Website: <Link href='www.my-office.am'>my-office.am</Link></span>
                </p>
              </div>
            </div>
            <div className="col-xl-3 col-sm-10 col-md-5 col-lg-4 col-lg-5">
              
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="tf__copyright">
                
                <ul className="d-flex flex-wrap">
                  <li>
                    <Link href="/privacy-policy">Կայքը պատրաստեց Touch Web Agency-ն | Բոլոր իրավունքները պահպանված են</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
