const slides = ["3.jpg"];

export function Hero() {
  return (
    <section className="main-slider-two hero-slider">
      <div className="main-slider-two__carousel">
        {slides.map((image) => (
          <div className="main-slider-two__item" key={image}>
            <div
              className="main-slider-two__bg"
              style={{
                backgroundImage: `url('/assets/images/slider/${image}')`,
              }}
            />


            <div className="main-slider-two__wrapper container">
                <div className="hero-content">
                  <p className="hero-subtitle">
                    Chào mừng đến với
                  </p>

                  <h1 className="hero-title">
                    P.A.C STONE
                  </h1>

                  <h2 className="hero-desc">
                    Đẳng cấp Công Trình Việt
                  </h2>
                  
                </div>
                <div className="conteiner-btn">
                 <a href="/gioi-thieu" className="hero-btn">
                    <span>Tìm hiểu thêm</span>
                    <i className="icon-right-arrow" >→</i>
                  </a>
                  </div>
                
              </div>
            </div>
        
        ))}
      </div>
    </section>
  );
}