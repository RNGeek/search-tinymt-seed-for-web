extern crate tinymt;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use tinymt::tinymt32;

#[wasm_bindgen(module = "../worker/worker")]
extern {
    fn postProgressAction(foundSeeds: &[u32], seed: u32) -> String;
}

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
  assert_eq!(natures.len(), 8);
  natures.iter().for_each(|&nature| assert!(nature < 25));

  let mut found_seeds: Vec<u32> = Vec::new();
  let param = tinymt32::Param {
    mat1: 0x8F7011EE,
    mat2: 0xFC78FF1F,
    tmat: 0x3793FDFF,
  };

  each_u32!(seed => {
    let mut rng = tinymt32::from_seed(param, seed);

    let found = natures
      .iter()
      .all(|&nature| nature == get_egg_nature(&mut rng, has_shiny_charm));


    if seed % 0x0100_0000 == 0 && seed != 0 {
      postProgressAction(found_seeds.as_slice(), seed);
    }

    if found {
      found_seeds.push(seed);
      postProgressAction(found_seeds.as_slice(), seed);
    }
  });

  found_seeds
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  #[ignore]
  fn case1() {
    let natures: [u32; 8] = [17, 24, 7, 16, 6, 20, 12, 18];
    let has_shiny_charm = false;
    let actual = search_tinymt_seed(&natures, has_shiny_charm);
    let expected: Vec<u32> = vec![0x0B76_DDAF, 0x261C6F52];
    assert_eq!(actual, expected);
  }

  #[test]
  #[ignore]
  fn case2() {
    let natures: [u32; 8] = [17, 19, 24, 7, 5, 18, 1, 16];
    let has_shiny_charm = true;
    let actual = search_tinymt_seed(&natures, has_shiny_charm);
    let expected: Vec<u32> = vec![0x0B76_DDAF];
    assert_eq!(actual, expected);
  }
}
