const riskZones = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Indirapuram High Flood Risk",
        "risk": "High",
        "score": 88
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              77.355,
              28.635
            ],
            [
              77.395,
              28.635
            ],
            [
              77.405,
              28.66
            ],
            [
              77.385,
              28.675
            ],
            [
              77.35,
              28.665
            ],
            [
              77.355,
              28.635
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Loni Medium Risk Zone",
        "risk": "Medium",
        "score": 61
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              77.275,
              28.72
            ],
            [
              77.325,
              28.72
            ],
            [
              77.34,
              28.755
            ],
            [
              77.3,
              28.775
            ],
            [
              77.27,
              28.75
            ],
            [
              77.275,
              28.72
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Noida Low Risk Zone",
        "risk": "Low",
        "score": 34
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              77.33,
              28.59
            ],
            [
              77.38,
              28.59
            ],
            [
              77.395,
              28.62
            ],
            [
              77.37,
              28.64
            ],
            [
              77.325,
              28.625
            ],
            [
              77.33,
              28.59
            ]
          ]
        ]
      }
    }
  ]
};

export default riskZones;
