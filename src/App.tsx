import './App.css';
import Footer from '@/components/Layout/Footer';
import Home from '@/components/Layout/Home';
import { Provider } from 'react-redux';
import store from '@/context/store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;