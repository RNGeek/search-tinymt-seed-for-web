#![feature(proc_macro)]

extern crate tinymt;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use tinymt::tinymt32;

trait Rng {
  fn gen_range(&mut self, m: u32) -> u32;
  fn skip(&mut self, n: usize);
}

impl Rng for tinymt32::Rng {
  fn gen_range(&mut self, m: u32) -> u32 {
    self.gen() % m
  }
  fn skip(&mut self, n: usize) {
    for _i in 0..n {
      self.next_state();
    }
  }
}

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
      count = count.wrapping_add(1);
    }
  };
}

fn get_egg_nature(rng: &mut tinymt32::Rng, has_shiny_charm: bool) -> u32 {
  rng.skip(1);                    // gender
  let nature = rng.gen_range(25); // nature
  rng.skip(1);                    // ability

  // inheriting IVs
  let mut inherit = [false; 6];
  for _i in 0..3 {
    let mut r = rng.gen_range(6) as usize;
    while inherit[r] {
      r = rng.gen_range(6) as usize;
    }
    inherit[r] = true;
    rng.skip(1);
  }

  rng.skip(6); // IVs
  rng.skip(1); // EC
  if has_shiny_charm {
    rng.skip(2); // shiny charm
  }
  // rng.skip(1); // ball
  rng.skip(2); // unknown

  nature
}

#[wasm_bindgen]
pub fn search_tinymt_seed(natures: &[u32], has_shiny_charm: bool) -> Vec<u32> {
  let mut seeds: Vec<u32> = Vec::new();

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
      seeds.push(seed);
    }
  });

  seeds
}
