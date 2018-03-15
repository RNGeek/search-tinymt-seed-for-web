extern crate tinymt;

pub mod math;

use tinymt::tinymt32;

#[no_mangle]
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
