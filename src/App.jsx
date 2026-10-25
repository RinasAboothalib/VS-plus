import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import Project from './pages/Project.jsx';
import Photography from './pages/Photography.jsx';
import Services from './pages/Services.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import { SocialMediaMarketing, WebDevelopment } from './pages/ServicePage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
	return (
		<Routes>
			<Route element={ <Layout /> }>
				<Route index element={ <Home /> } />
				<Route path="work" element={ <Work /> } />
				<Route path="work/:slug" element={ <Project /> } />
				<Route path="photography" element={ <Photography /> } />
				<Route path="services" element={ <Services /> } />
				<Route path="social-media-marketing" element={ <SocialMediaMarketing /> } />
				<Route path="web-development" element={ <WebDevelopment /> } />
				<Route path="about" element={ <About /> } />
				<Route path="contact" element={ <Contact /> } />
				<Route path="*" element={ <NotFound /> } />
			</Route>
		</Routes>
	);
}
