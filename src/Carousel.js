import React from "react";
import Slider from "react-slick";

class Carousel extends React.Component {
	render() {
		const settings = {
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
		}

		return (
			<div style={{ margin: "auto", textAlign: "center", width: "90%" }}>
				<Slider {...settings}>

				{this.props.pictures.map((image) => (
					<div>
						<img style={{ margin: "auto", height: "300px" }}
							key={image.id}
							src={image.imageUrl}
							alt=""/>
					</div>
				))}
				
				</Slider>
			</div>
		);
	}
}

export default Carousel;