export const Footer = () => (
	<footer className="footer mt-auto py-4 text-center bg-dark text-light">
		<div className="container">
			<p className="mb-1">
				<a href="#" className="text-success text-decoration-none mx-2">Nosotros</a> |
				<a href="#" className="text-success text-decoration-none mx-2">Servicios</a> |
				<a href="#" className="text-success text-decoration-none mx-2">Pagos</a> |
				<a href="#" className="text-success text-decoration-none mx-2">Ayuda</a>
			</p>
			<p className="mb-0 text-muted small">
				&copy; {new Date().getFullYear()}
			</p>
		</div>
	</footer>
);
