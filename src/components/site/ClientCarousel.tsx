const colors = [
  "marble-color-1.png",
  "marble-color-2.png",
  "marble-color-3.png",
  "marble-color-4.png",
  "marble-color-5.png",
  "marble-color-6.png",
];

export function ClientCarousel() {
  return (
    <div className="client-carousel client-carousel--two">
      <div className="container">
        <div className="client-carousel__one">
          <div className="row gutter-y-30 justify-content-center">
            {colors.map((image) => (
              <div className="col-6 col-sm-4 col-md-2" key={image}>
                <div className="client-carousel__one__item">
                  <a href="/san-pham">
                    <img
                      src={`/assets/images/resources/${image}`}
                      alt="marble color"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}