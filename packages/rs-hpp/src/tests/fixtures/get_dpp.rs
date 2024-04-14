// use crate::{
//     hellar_platform_protocol::DPPOptions, state_repository::MockStateRepositoryLike,
//     HellarPlatformProtocol, NativeBlsModule,
// };
//
// // TODO creation of DPP object for testing needs to be improved
// pub fn get_hpp() -> HellarPlatformProtocol<MockStateRepositoryLike, NativeBlsModule> {
//     HellarPlatformProtocol::new(
//         DPPOptions {
//             current_protocol_version: None,
//         },
//         MockStateRepositoryLike::new(),
//         NativeBlsModule::default(),
//     )
//     .unwrap()
// }
