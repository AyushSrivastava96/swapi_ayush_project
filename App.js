const { useState, useEffect } = React;

function App() {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPlanets(`https://swapi.dev/api/planets/?page=${currentPage}`);
  }, [currentPage]);

  const fetchPlanets = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPlanets(data.results);
      setNextPage(data.next);
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Star Wars Planets Directory</h1>
      {planets.map((planet, index) => (
        <div key={index} className="planet-card">
          <h2>{planet.name}</h2>
          <p>Climate: {planet.climate}</p>
          <p>Population: {planet.population}</p>
          <p>Terrain: {planet.terrain}</p>
          <ResidentList residents={planet.residents} />
        </div>
      ))}
      <div className="pagination">
        {currentPage > 1 && (
          <a href="#" className="page-link" onClick={() => handlePagination(currentPage - 1)}>
            Previous
          </a>
        )}
        {nextPage && (
          <a href="#" className="page-link" onClick={() => handlePagination(currentPage + 1)}>
            Next
          </a>
        )}
      </div>
    </div>
  );
}

function ResidentList({ residents }) {
  const [residentData, setResidentData] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const promises = residents.map(url => fetch(url).then(res => res.json()));
        const data = await Promise.all(promises);
        setResidentData(data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    fetchResidents();
  }, [residents]);

  return (
    <ul className="resident-list">
      {residentData.map((resident, index) => (
        <li key={index} className="resident-item">
          <p>Name: {resident.name}</p>
          <p>Height: {resident.height}</p>
          <p>Mass: {resident.mass}</p>
          <p>Gender: {resident.gender}</p>
        </li>
      ))}
    </ul>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
