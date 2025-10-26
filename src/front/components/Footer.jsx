export const Footer = () => (
	<footer className="footer mt-auto py-5 text-center bg-black text-light border-top border-success">
		<div className="container">
			<div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-3">
				<a href="#" className="text-success text-decoration-none fw-semibold">
					<i className="fa-solid fa-building me-1"></i>Nosotros
				</a>
				<span className="text-secondary">|</span>
				<a href="#" className="text-success text-decoration-none fw-semibold">
					<i className="fa-solid fa-briefcase me-1"></i>Servicios
				</a>
				<span className="text-secondary">|</span>
				<a href="#" className="text-success text-decoration-none fw-semibold">
					<i className="fa-solid fa-credit-card me-1"></i>Pagos
				</a>
				<span className="text-secondary">|</span>
				<a href="#" className="text-success text-decoration-none fw-semibold">
					<i className="fa-solid fa-circle-question me-1"></i>Ayuda
				</a>
			</div>

			<div className="small">
				<p className="mb-1">
					&copy; {new Date().getFullYear()} <span className="text-success fw-semibold">ShopNow</span>. Todos los derechos reservados.
				</p>
				<p className="mb-0">
					<i className="fa-solid fa-shield-halved text-success me-2"></i>Compra segura • Sitio verificado
				</p>
			</div>
		</div>
	</footer>
);
