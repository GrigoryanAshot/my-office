import React from "react";
import ContactForm from "../form/ContactForm";
import Image from "next/image";

const ContactPageSection = () => {
  return (
    <section className="tf__contact_page mt_190 xs_mt_95">
      {/* Main title for the contact page */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '0px',
        borderRadius: '0px',
      
        margin: '-30px auto 50px',
        maxWidth: '800px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        position: 'relative',
        zIndex: 1000
      }}>
        Լավագույն լուծումները Ձեր գրասենյակի համար
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xxl-8 col-xl-7 col-lg-6 wow fadeInLeft" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
           <img src="/images/photo1.jpg" style={{ width: '100%', maxWidth: 1000, borderRadius: 20, objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
          </div>
          <div className="col-xxl-4 col-xl-5 col-lg-6 wow fadeInRight" style={{ marginBottom: 24 }}>
            <div className="tf__contact_text">
              <div className="tf__contact_single">
                <div className="icon blue">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="text">
                  <h3>Զանգահարել</h3>
                  <a href="callto:+37455160161">055 160 161 </a>
                </div>
              </div>
              <div className="tf__contact_single">
                <div className="icon orange">
                <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="text">
                  <h3>Էլ․ հասցե</h3>
                  <a href="mailto:myofficearmenia@gmail.com">myofficearmenia@gmail.com</a>
                </div>
              </div>
              <div className="tf__contact_single">
                <div className="icon green">
                <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div className="text">
                  <h3>Հասցե</h3>
                  <p>ք․ Աբովյան, Սևանի փ․ 11</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12 wow fadeInUp">
            <div className="tf__contact_map mt_100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4865.622283419117!2d44.62313419230683!3d40.28203865669623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406aa02a9b46fee3%3A0x8fb70bce9249f58a!2zMTEg1Y3Wh9Wh1bYg1oPVuNWy1bjWgSwg1LHVotW41b7VtdWh1bYgMjIwNA!5e1!3m2!1shy!2sam!4v1711393966069!5m2!1shy!2sam"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPageSection;
