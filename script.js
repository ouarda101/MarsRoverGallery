
(function() {
    
    const apiKey = '3v8sVcOxoTqzdMxRGa9GcAQsDEzLm3CjWrh7INf7';
    const apiUrlBase = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';

   
    const roverSelect = document.getElementById('rover-select');
    const solInput = document.getElementById('sol-input');
    const cameraSelect = document.getElementById('camera-select');
    const fetchBtn = document.getElementById('fetch-btn');
    const photoContainer = document.getElementById('photo-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const metadataModal = document.getElementById('metadata-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalImage = document.getElementById('modal-image');
    const metaRover = document.getElementById('meta-rover');
    const metaCameraName = document.getElementById('meta-camera-name');
    const metaEarthDate = document.getElementById('meta-earth-date');
    const metaSol = document.getElementById('meta-sol');
    const metaLandingDate = document.getElementById('meta-landing-date');

    
    const roverCameras = {
        curiosity: [
            { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
            { name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
            { name: 'MAST', fullName: 'Mast Camera' },
            { name: 'CHEMCAM', fullName: 'Chemistry and Camera Complex' },
            { name: 'NAVCAM', fullName: 'Navigation Camera' },
        ],
        opportunity: [
            { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
            { name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
            { name: 'NAVCAM', fullName: 'Navigation Camera' },
            { name: 'PANCAM', fullName: 'Panoramic Camera' },
            { name: 'MINITES', fullName: 'Miniature Thermal Emission Spectrometer' },
        ],
        spirit: [
            { name: 'FHAZ', fullName: 'Front Hazard Avoidance Camera' },
            { name: 'RHAZ', fullName: 'Rear Hazard Avoidance Camera' },
            { name: 'NAVCAM', fullName: 'Navigation Camera' },
            { name: 'PANCAM', fullName: 'Panoramic Camera' },
            { name: 'MINITES', fullName: 'Miniature Thermal Emission Spectrometer' },
        ],
    };

    
    function populateCameraSelect() {
        const selectedRover = roverSelect.value;
        const cameras = roverCameras[selectedRover] || [];
        cameraSelect.innerHTML = ''; 

        cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.name;
            option.textContent = camera.fullName;
            cameraSelect.appendChild(option);
        });
    }

    
    async function fetchMarsPhotos() {
        const rover = roverSelect.value;
        const sol = solInput.value;
        const camera = cameraSelect.value;

        
        if (sol < 0) {
            showError('Please enter a valid Martian sol (day). Must be a positive number.');
            return;
        }

        
        const url = `${apiUrlBase}${rover}/photos?sol=${sol}&camera=${camera}&api_key=${apiKey}`;

        photoContainer.innerHTML = ''; 
        errorMessage.classList.add('hidden'); 
        loadingSpinner.classList.remove('hidden'); 

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            
            if (data.photos.length === 0) {
                showError('No photos found for the selected criteria. Try a different sol or camera.');
            } else {
                renderPhotos(data.photos);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
            showError('Failed to fetch photos. Please try again later.');
        } finally {
            loadingSpinner.classList.add('hidden'); 
        }
    }

    /**
     * Renders the fetched photos in the gallery grid.
     * @param {Array} photos 
     */
    function renderPhotos(photos) {
        photoContainer.innerHTML = ''; 

        photos.forEach(photo => {
            
            const photoCard = document.createElement('div');
            photoCard.className = 'relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105';

            
            const img = document.createElement('img');
            img.src = photo.img_src;
            img.alt = `Mars photo taken by ${photo.camera.full_name}`;
            img.className = 'w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-110';
            img.onerror = () => img.src = `https://placehold.co/500x500/161b22/8b949e?text=Image+Not+Found`;

            
            const overlay = document.createElement('div');
            overlay.className = 'absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-3 text-white text-center rounded-b-xl transition-opacity opacity-0 group-hover:opacity-100';
            overlay.textContent = photo.camera.full_name;

            
            photoCard.addEventListener('click', () => showMetadataModal(photo));

            photoCard.appendChild(img);
            photoCard.appendChild(overlay);
            photoContainer.appendChild(photoCard);
        });
    }

    /**
     * Displays the metadata for a selected photo in a modal.
     * @param {Object} photo - The photo object with all its metadata.
     */
    function showMetadataModal(photo) {
        modalImage.src = photo.img_src;
        modalImage.alt = `Photo taken by ${photo.rover.name} on Martian Sol ${photo.sol}`;
        metaRover.textContent = photo.rover.name;
        metaCameraName.textContent = photo.camera.full_name;
        metaEarthDate.textContent = photo.earth_date;
        metaSol.textContent = photo.sol;
        metaLandingDate.textContent = photo.rover.landing_date;
        
        metadataModal.classList.remove('hidden');
    }

   
    function hideMetadataModal() {
        metadataModal.classList.add('hidden');
    }

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    
    roverSelect.addEventListener('change', populateCameraSelect);

    
    fetchBtn.addEventListener('click', fetchMarsPhotos);
    
    
    closeModalBtn.addEventListener('click', hideMetadataModal);
    
    
    metadataModal.addEventListener('click', (event) => {
        if (event.target === metadataModal) {
            hideMetadataModal();
        }
    });

    
    populateCameraSelect();
})();