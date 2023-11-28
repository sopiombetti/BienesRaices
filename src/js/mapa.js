(function() {
    
    const lat = -34.5280294;
    const lng = -58.4835378;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker
     
    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
     
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
     
    // El Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target

        const posicion = marker.getLatLng()

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        //Obtener la info de la calle
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){
            console.log(resultado)
            
            marker.bindPopup(resultado.address.LongLabel).openPopup()

            document.querySelector('#calle').value = resultado?.address?.Address ?? ''
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''
        })
    })

})()
