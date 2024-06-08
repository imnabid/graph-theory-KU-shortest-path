import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import HomeInteractive from './components/HomeInteractive';
import HomeV1 from './components/HomeV1';
import SnackBar from './components/SnackBar';
import { useContext } from 'react';
import { MapContext } from './GlobalContext';


function App() {
  const {showSnackBar} = useContext(MapContext)
  return (
    <div>

      <Home />
    // <HomeV1 />
    // <HomeInteractive />
      {showSnackBar.show && <SnackBar />}
    </div>
  );
}

export default App;
