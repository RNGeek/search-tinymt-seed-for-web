use wasm_bindgen::prelude::*;
use tinymt::tinymt32;

macro_rules! each_u32 {
  ($var:ident => $code:block) => {
    each_u32!(0x0000_0000, 0xFFFF_FFFF, $var => $code)
  };
  ($from:expr, $to:expr, $var:ident => $code:block) => {
    let mut count: u32 = $from;
    loop {
      let $var: u32 = count;
      { $code }
      if count == $to {
        break;
      }
      count += 1;
    }
  };
}

#[wasm_bindgen]
pub fn gen_by_index(seed: u32, index: usize) -> u32 {
  let param = tinymt32::Param {
    mat1: 0x8F7011EE,
    mat2: 0xFC78FF1F,
    tmat: 0x3793fdff,
  };
  let seed = seed;

  let mut rng = tinymt32::from_seed(param, seed);
  for _i in 0..index {
    rng.next_state()
  }
  rng.temper()
}

fn get_egg_nature(rng: &mut tinymt32::Rng, has_shiny_charm: bool) -> u32 {
  rng.next_state();            // gender
  let nature = rng.gen() % 25; // nature
  rng.next_state();            // ability

  let mut inherit = [false; 6];

  for _i in 0..3 {
    let mut r = (rng.gen() % 6) as usize;
    while inherit[r] {
      r = (rng.gen() % 6) as usize;
    }
    inherit[r] = true;
    rng.next_state();
  }

  for _i in 0..6 {
    rng.next_state(); // IVs
  }

  rng.next_state(); // EC

  if has_shiny_charm {
    for _i in 0..2 {
      rng.next_state();
    }
  }

  // rng.next_state(); // ball
  rng.next_state(); // unknown
  rng.next_state(); // unknown

  nature
}

#[wasm_bindgen]
pub fn search_tinymt_seed(
  nature1: u32,
  nature2: u32,
  nature3: u32,
  nature4: u32,
  nature5: u32,
  nature6: u32,
  nature7: u32,
  nature8: u32,
  has_shiny_charm: bool,
) -> u32 {
  let natures = [
    nature1,
    nature2,
    nature3,
    nature4,
    nature5,
    nature6,
    nature7,
    nature8,
  ];

  each_u32!(seed => {
    let param = tinymt32::Param {
      mat1: 0x8F7011EE,
      mat2: 0xFC78FF1F,
      tmat: 0x3793FDFF,
    };
    let mut rng = tinymt32::from_seed(param, seed);

    let found = natures
      .iter()
      .all(|&nature| nature == get_egg_nature(&mut rng, has_shiny_charm));

    if found {
      return seed;
    }
  });
  0xFFFF_FFFF
}
