mod transformer;

use hpp::document::Document;
use hpp::identifier::Identifier;
use hpp::prelude::Revision;

use serde::{Deserialize, Serialize};

/// action v0
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IdentityCreditWithdrawalTransitionActionV0 {
    /// identity id
    pub identity_id: Identifier,
    /// revision
    pub revision: Revision,
    /// prepared withdrawal document
    pub prepared_withdrawal_document: Document,
}
