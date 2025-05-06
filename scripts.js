

var controls = {
  angleZ_heading: 0,
  angleY_attitude: 0,
  angleX_bank: 0,
  camZoom: 1.5,
  camLongitude: 180,
  camLatitude: 15
};

function init() {
  "use strict";

  // Parameters
  const INITIAL_ANGLE_Z_HEADING = 0; // [deg]
  const INITIAL_ANGLE_Y_ATTITUDE = 0; // [deg]
  const INITIAL_ANGLE_X_BANK = 0; // [deg]
  const INITIAL_CAMERA_ZOOM = 1.5;
  const INITIAL_CAMERA_LONGITUDE = 180; // [deg]
  const INITIAL_CAMERA_LATITUDE = 15; // [deg]

  // Scene
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  //-------------------------------------------------------------
  // Horizontal circle curve

  var horizontalCircleCurve = (function () {
    const RADIUS = 5;
    const SEGMENTS = 48;
    const COLOR = 0x999999;

    var vertices = [];
    for (var i = 0; i <= SEGMENTS; i++) {
      vertices.push(
        new THREE.Vector3(
          RADIUS * Math.cos(((2 * Math.PI) / SEGMENTS) * i),
          RADIUS * Math.sin(((2 * Math.PI) / SEGMENTS) * i),
          0
        )
      );
    }

    var geom = new THREE.Geometry();
    geom.vertices = vertices;

    var curve = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({
        color: COLOR,
      })
    );

    return curve;
  })();

  scene.add(horizontalCircleCurve);

  //-------------------------------------------------------------
  // Airplane

  var airplane = (function () {
    const FRONT_LENGTH = 3.5;
    const REAR_LENGTH = 1.5;
    const WING_SPAN = 4;
    const FUSELAGE_WIDTH = 0.4;
    const FUSELAGE_DEPTH = 1.5;
    const SURFACE_COLOR = 0x00ffff;
    const WIREFLAME_COLOR = 0x000000;

    var vertices = [
      new THREE.Vector3(FRONT_LENGTH, 0, 0),
      new THREE.Vector3(-REAR_LENGTH, -WING_SPAN / 2, 0),
      new THREE.Vector3(-REAR_LENGTH, -FUSELAGE_WIDTH / 2, 0),
      new THREE.Vector3(-REAR_LENGTH, 0, FUSELAGE_DEPTH),
      new THREE.Vector3(-REAR_LENGTH, FUSELAGE_WIDTH / 2, 0),
      new THREE.Vector3(-REAR_LENGTH, WING_SPAN / 2, 0),
    ];

    var faces = [
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(0, 2, 3),
      new THREE.Face3(0, 3, 4),
      new THREE.Face3(0, 4, 5),
    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();

    var frontSurface = new THREE.Mesh(
      geom,
      new THREE.MeshLambertMaterial({
        color: SURFACE_COLOR,
        side: THREE.FrontSide,
        wireframe: false,
      })
    );
    var backSurface = new THREE.Mesh(
      geom,
      new THREE.MeshLambertMaterial({
        color: SURFACE_COLOR,
        side: THREE.BackSide,
        wireframe: false,
      })
    );
    var wireframe = new THREE.Mesh(
      geom,
      new THREE.MeshBasicMaterial({
        color: WIREFLAME_COLOR,
        wireframe: true,
      })
    );

    // Additional fold lines for better appearance
    var geomFoldLines = new THREE.Geometry();
    geomFoldLines.vertices = [
      new THREE.Vector3(-REAR_LENGTH, -FUSELAGE_WIDTH / 2, 0.01), // small offset in z
      new THREE.Vector3(FRONT_LENGTH, 0, 0.01), // small offset in z
      new THREE.Vector3(-REAR_LENGTH, FUSELAGE_WIDTH / 2, 0.01), // small offset in z
    ];
    var foldLines = new THREE.Line(
      geomFoldLines,
      new THREE.LineBasicMaterial({
        color: WIREFLAME_COLOR,
      })
    );

    // Arrow axes
    var arrowAxes = (function () {
      const AXIS_LENGTH = 5;
      const HEAD_LENGTH = 0.4;
      const AXIS_RADIUS = 0.02;
      const HEAD_RADIUS = 0.15;
      const SEGMENTS = 8;

      var geomCylArrow = new THREE.CylinderGeometry(
        AXIS_RADIUS,
        AXIS_RADIUS,
        AXIS_LENGTH - HEAD_LENGTH,
        SEGMENTS
      );
      var geomConeArrow = new THREE.ConeGeometry(
        HEAD_RADIUS,
        HEAD_LENGTH,
        SEGMENTS
      );

      // X axis arrow
      var cylArrowX = new THREE.Mesh(
        geomCylArrow,
        new THREE.MeshLambertMaterial({
          color: 0xff0000,
        })
      );
      cylArrowX.position.x = (AXIS_LENGTH - HEAD_LENGTH) / 2;
      cylArrowX.rotation.z = -Math.PI / 2;

      var coneArrowX = new THREE.Mesh(
        geomConeArrow,
        new THREE.MeshLambertMaterial({
          color: 0xff0000,
        })
      );
      coneArrowX.position.x = AXIS_LENGTH - HEAD_LENGTH / 2;
      coneArrowX.rotation.z = -Math.PI / 2;

      // Y axis arrow
      var cylArrowY = new THREE.Mesh(
        geomCylArrow,
        new THREE.MeshLambertMaterial({
          color: 0x00ff00,
        })
      );
      cylArrowY.position.y = (AXIS_LENGTH - HEAD_LENGTH) / 2;

      var coneArrowY = new THREE.Mesh(
        geomConeArrow,
        new THREE.MeshLambertMaterial({
          color: 0x00ff00,
        })
      );
      coneArrowY.position.y = AXIS_LENGTH - HEAD_LENGTH / 2;

      // Z axis arrow
      var cylArrowZ = new THREE.Mesh(
        geomCylArrow,
        new THREE.MeshLambertMaterial({
          color: 0x0000ff,
        })
      );
      cylArrowZ.position.z = (AXIS_LENGTH - HEAD_LENGTH) / 2;
      cylArrowZ.rotation.x = Math.PI / 2;

      var coneArrowZ = new THREE.Mesh(
        geomConeArrow,
        new THREE.MeshLambertMaterial({
          color: 0x0000ff,
        })
      );
      coneArrowZ.position.z = AXIS_LENGTH - HEAD_LENGTH / 2;
      coneArrowZ.rotation.x = Math.PI / 2;

      // Center sphere
      var geomSphCenter = new THREE.SphereGeometry(0.14, 8, 8);
      var sphCenter = new THREE.Mesh(
        geomSphCenter,
        new THREE.MeshLambertMaterial({
          color: 0xcccccc,
        })
      );

      // Grouping
      var arrowAxes = new THREE.Group();
      arrowAxes.add(cylArrowX);
      arrowAxes.add(coneArrowX);
      arrowAxes.add(cylArrowY);
      arrowAxes.add(coneArrowY);
      arrowAxes.add(cylArrowZ);
      arrowAxes.add(coneArrowZ);
      arrowAxes.add(sphCenter);

      return arrowAxes;
    })();

    // Grouping
    var airplane = new THREE.Group();
    airplane.add(frontSurface);
    airplane.add(backSurface);
    airplane.add(wireframe);
    airplane.add(foldLines);
    airplane.add(arrowAxes);

    airplane.position.z = -0.01; // small offset in -z to avoid overlap with the heading angle circle

    return airplane;
  })();

  scene.add(airplane);

  function setAirplane(headingAngle, attitudeAngle, bankAngle) {
    airplane.rotation.copy(
      new THREE.Euler(
        (bankAngle * Math.PI) / 180,
        (attitudeAngle * Math.PI) / 180,
        (headingAngle * Math.PI) / 180,
        "ZYX"
      )
    );
  }

  setAirplane(
    INITIAL_ANGLE_Z_HEADING,
    INITIAL_ANGLE_Y_ATTITUDE,
    INITIAL_ANGLE_X_BANK
  );

  //-------------------------------------------------------------
  // Line of heading

  var lineOfHeading = (function () {
    const LENGTH = 5.1;
    const COLOR = 0x999999;

    var geom = new THREE.Geometry();
    geom.vertices = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(LENGTH, 0, 0),
    ];

    var line = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({
        color: COLOR,
      })
    );

    return line;
  })();

  scene.add(lineOfHeading);

  function setLineOfHeading(headingAngle) {
    lineOfHeading.rotation.z = (headingAngle * Math.PI) / 180;
  }

  setLineOfHeading(INITIAL_ANGLE_Z_HEADING);

  //-------------------------------------------------------------
  // Line of nodes

  var lineOfNodes = (function () {
    const LENGTH = 5.1;
    const COLOR = 0x999999;

    var geom = new THREE.Geometry();
    geom.vertices = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, LENGTH, 0),
    ];

    var line = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({
        color: COLOR,
      })
    );

    return line;
  })();

  scene.add(lineOfNodes);

  function setLineOfNodes(headingAngle) {
    lineOfNodes.rotation.z = (headingAngle * Math.PI) / 180;
  }

  setLineOfNodes(INITIAL_ANGLE_Z_HEADING);

  //-------------------------------------------------------------
  // Heading angle circle

  function createHeadingAngleCircle(headingAngle) {
    const RADIUS = 5;
    const MAX_SEGMENT_ANGLE = 5; // [deg]
    const COLOR = 0x0000ff;
    const OPACITY = 0.3;

    var segments = Math.ceil(360 / MAX_SEGMENT_ANGLE);

    var geom = new THREE.CircleGeometry(
      RADIUS,
      segments,
      0,
      (Math.max(headingAngle, 0.1) * Math.PI) / 180
    );
    var mesh = new THREE.Mesh(
      geom,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        side: THREE.DoubleSide,
        opacity: OPACITY,
        transparent: true,
      })
    );
    return mesh;
  }

  var headingAngleCircle = createHeadingAngleCircle(
    INITIAL_ANGLE_Z_HEADING
  );

  scene.add(headingAngleCircle);

  //-------------------------------------------------------------
  // Attitude angle circle

  function createAttitudeAngleCircle(headingAngle, attitudeAngle) {
    const RADIUS = 5;
    const MAX_SEGMENT_ANGLE = 5; // [deg]
    const COLOR = 0x00ff00;
    const OPACITY = 0.3;

    var segments = Math.ceil(360 / MAX_SEGMENT_ANGLE);

    var geom = new THREE.CircleGeometry(
      RADIUS,
      segments,
      0,
      (Math.max(Math.abs(attitudeAngle), 0.1) * Math.PI) / 180
    );
    var mesh = new THREE.Mesh(
      geom,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        side: THREE.DoubleSide,
        opacity: OPACITY,
        transparent: true,
      })
    );
    if (attitudeAngle >= 0) {
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.y = (-headingAngle * Math.PI) / 180;
    } else {
      mesh.rotation.x = Math.PI / 2;
      mesh.rotation.y = (headingAngle * Math.PI) / 180;
    }
    return mesh;
  }

  var attitudeAngleCircle = createAttitudeAngleCircle(
    INITIAL_ANGLE_Z_HEADING,
    INITIAL_ANGLE_Y_ATTITUDE
  );

  scene.add(attitudeAngleCircle);

  //-------------------------------------------------------------
  // Bank angle circle

  function createBankAngleCircle(headingAngle, attitudeAngle, bankAngle) {
    const RADIUS = 5;
    const MAX_SEGMENT_ANGLE = 5; // [deg]
    const COLOR = 0xff0000;
    const OPACITY = 0.3;

    var segments = Math.ceil(360 / MAX_SEGMENT_ANGLE);

    var geom = new THREE.CircleGeometry(
      RADIUS,
      segments,
      Math.PI / 2,
      (Math.max(bankAngle, 0.1) * Math.PI) / 180
    );
    var mesh = new THREE.Mesh(
      geom,
      new THREE.MeshBasicMaterial({
        color: COLOR,
        side: THREE.DoubleSide,
        opacity: OPACITY,
        transparent: true,
      })
    );
    mesh.rotation.copy(
      new THREE.Euler(
        0,
        ((attitudeAngle + 90) * Math.PI) / 180,
        (headingAngle * Math.PI) / 180,
        "ZYX"
      )
    );
    return mesh;
  }

  var bankAngleCircle = createBankAngleCircle(
    INITIAL_ANGLE_Z_HEADING,
    INITIAL_ANGLE_Y_ATTITUDE,
    INITIAL_ANGLE_X_BANK
  );

  scene.add(bankAngleCircle);

  //-------------------------------------------------------------
  // Static Axes

  var staticAxes = new THREE.AxesHelper(50);
  scene.add(staticAxes);

  //-------------------------------------------------------------
  // Camera

  var camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  function setCamera(zoom, longitude, latitude) {
    const DISTANCE = 15;

    camera.up.set(0, 0, -1);
    camera.position.x =
      DISTANCE *
      Math.cos((latitude * Math.PI) / 180) *
      Math.cos((longitude * Math.PI) / 180);
    camera.position.y =
      -DISTANCE *
      Math.cos((latitude * Math.PI) / 180) *
      Math.sin((longitude * Math.PI) / 180);
    camera.position.z = -DISTANCE * Math.sin((latitude * Math.PI) / 180);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
  }

  setCamera(
    controls.camZoom,
    controls.camLongitude,
    controls.camLatitude
  );

  //-------------------------------------------------------------
  // Mouse controls for camera rotation

  var isMouseDown = false;
  var previousMousePosition = {
    x: 0,
    y: 0
  };

  document.addEventListener('mousedown', function(event) {
    isMouseDown = true;
  }, false);

  document.addEventListener('mouseup', function(event) {
    isMouseDown = false;
  }, false);

  document.addEventListener('mousemove', function(event) {
    if (isMouseDown) {
      var deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
      };

      controls.camLongitude += deltaMove.x * 0.1;
      controls.camLatitude -= deltaMove.y * 0.1;

      setCamera(
        controls.camZoom,
        controls.camLongitude,
        controls.camLatitude
      );
    }

    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY
    };
  }, false);

  //-------------------------------------------------------------
  // Mouse wheel controls for zoom

  document.addEventListener('wheel', function(event) {
    controls.camZoom += event.deltaY * -0.001;
    controls.camZoom = Math.min(Math.max(0.1, controls.camZoom), 3);
    setCamera(
      controls.camZoom,
      controls.camLongitude,
      controls.camLatitude
    );
  }, false);

  //-------------------------------------------------------------
  // SpotLight

  var spotLight = new THREE.SpotLight(0xffffff);

  scene.add(spotLight);

  function setSpotLight() {
    spotLight.position.x = 2 * camera.position.x;
    spotLight.position.y = 2 * camera.position.y;
    spotLight.position.z = 2 * camera.position.z;
  }

  setSpotLight();

  //-------------------------------------------------------------
  // AmbientLight

  var ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);

  //-------------------------------------------------------------
  // Reset Camera Button

  document.getElementById('reset-camera-button').addEventListener('click', function() {
    setCamera(INITIAL_CAMERA_ZOOM, 180, 15);
  });

  //-------------------------------------------------------------
  // Renderer

  var container = document.getElementById("WebGL-output");
  var renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //-------------------------------------------------------------
  // Render

  function render() {
    setAirplane(
      controls.angleZ_heading,
      controls.angleY_attitude,
      controls.angleX_bank
    );
    setLineOfHeading(controls.angleZ_heading);
    setLineOfNodes(controls.angleZ_heading);
    setSpotLight();

    

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();

  //-------------------------------------------------------------
  // Response to window resize

  window.addEventListener("resize", onResize, false);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.onload = init;
