import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { PageProvider } from './context/PageContext.jsx';
import { SheetProvider } from './context/SheetContext.jsx';
import { TransitionProvider } from './context/TransitionContext.jsx';
import './styles/style.css';
import './styles/pages.css';

/*
 * No StrictMode: the pinned ScrollTriggers and the nav's SVG timelines mutate
 * the DOM, and a dev-only double mount would pin twice before reverting.
 */
createRoot( document.getElementById( 'root' ) ).render(
	<BrowserRouter>
		<PageProvider>
			<SheetProvider>
				<TransitionProvider>
					<App />
				</TransitionProvider>
			</SheetProvider>
		</PageProvider>
	</BrowserRouter>
);
