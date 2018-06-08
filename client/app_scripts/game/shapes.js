// Owner: Nikola Jovanovic (NikolaJov96)

// Summary: Definitions of object shapes
//   vertex format: 
//     x, y and z vertex coord,
//     x, y and z directions of vertex normal vector (used for lighting)
//     x and y vertex position in texture
//   inddex format: 1st, 2nd, 3rd vertex forming a triangle

objectShapes.ship = {
    vert: [
        0.0,    100.0,  0.0,        0.0, 0.7, 1.0,      0.5,   0.0,
        -15.0,  15.0,   20.0,       0.0, 0.7, 1.0,      0.425, 0.435,
        15.0,   15.0,   20.0,       0.0, 0.7, 1.0,      0.575, 0.425,

        0.0,    100.0,  0.0,        0.0, 1.0, 1.0,      0.5,   0.0,
        -15.0,  15.0,   20.0,       -0.5, 1.0, 1.0,     0.425, 0.425,
        -40.0,  0.0,    0.0,        -0.5, 1.0, 1.0,     0.3,   0.5,

        0.0,    100.0,  0.0,        0.0, 1.0, 1.0,      0.5,   0.0,
        15.0,   15.0,   20.0,       0.5, 1.0, 1.0,      0.575, 0.425,
        40.0,   0.0,    0.0,        0.5, 1.0, 1.0,      0.7,   0.5,
                
        -15.0,  15.0,   20.0,       0.0, 0.0, 1.0,      0.425, 0.425,
        15.0,   15.0,   20.0,       0.0, 0.0, 1.0,      0.575, 0.425,
        15.0,   -100.0, 10.0,       0.0, 0.0, 1.0,      0.575, 1.0,
                
        -15.0,  15.0,   20.0,       0.0, 0.0, 1.0,      0.425, 0.425,
        -15.0,  -100.0, 10.0,       0.0, 0.0, 1.0,      0.425, 1.0,
        15.0,   -100.0, 10.0,       0.0, 0.0, 1.0,      0.575, 1.0,
                
        -15.0,  15.0,   20.0,       -0.3, 0.0, 1.0,     0.425, 0.425,
        -40.0,  0.0,    0.0,        -0.3, 0.0, 1.0,     0.3,   0.5,
        -15.0,  -100.0, 10.0,       -0.3, 0.0, 1.0,     0.425, 1.0,
                
        15.0,   15.0,   20.0,       0.3, 0.0, 1.0,      0.575, 0.425,
        40.0,   0.0,    0.0,        0.3, 0.0, 1.0,      0.7,   0.5,
        15.0,   -100.0, 10.0,       0.3, 0.0, 1.0,      0.575, 1.0,
                
        -40.0,  0.0,    0.0,        0.0, 0.0, 1.0,      0.3,   0.5,
        -100.0, -100.0, 0.0,        0.0, 0.0, 1.0,      0.0,   1.0,
        -15.0,  -100.0, 10.0,       0.0, 0.0, 1.0,      0.425, 1.0,
                
        40.0,   0.0,    0.0,        0.0, 0.0, 1.0,      0.7,   0.5,
        15.0,   -100.0, 10.0,       0.0, 0.0, 1.0,      0.575, 1.0,
        100.0,  -100.0, 0.0,        0.0, 0.0, 1.0,      1.0,   1.0,
        
        0.0,    -11.0,  0.0,        1.0, 0.0, 0.0,      0.5,   0.1,
        0.0,    -45.0,  0.0,        1.0, 0.0, 0.0,      0.5,   0.1,
        0.0,    -100.0, 70.0,       1.0, 0.0, 0.0,      0.5,   0.1
    ],
    ind: [
        0,  1,  2,
        3,  4,  5,
        6,  7,  8,
        9,  10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23,
        24, 25, 26,
        27, 28, 29
    ]
};

objectShapes.exhaust = {
    vert: [
        60.0,  25.0,  0.0,      0.0, 0.0, 1.0,    0.0, 0.0,
        -60.0, -25.0, 0.0,      0.0, 0.0, 1.0,    1.0, 1.0,
        60.0,  -25.0, 0.0,      0.0, 0.0, 1.0,    1.0, 0.0,
        -60.0, 25.0,  0.0,      0.0, 0.0, 1.0,    0.0, 1.0
    ],
    ind: [
        0, 1, 2,
        0, 1, 3
    ]
};

objectShapes.spaceBody = {
    vert: [
        100.0,  100.0,  0.0,      0.0, 0.0, 1.0,    0.0, 0.0,
        -100.0, -100.0, 0.0,      0.0, 0.0, 1.0,    1.0, 1.0,
        100.0,  -100.0, 0.0,      0.0, 0.0, 1.0,    0.0, 1.0,
        -100.0, 100.0,  0.0,      0.0, 0.0, 1.0,    1.0, 0.0
    ],
    ind: [
        0, 1, 2,
        0, 1, 3
    ]
};
