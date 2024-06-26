use grovedb::TransactionArg;

use crate::drive::fee::get_overflow_error;
use crate::drive::Drive;

use crate::error::Error;
use hpp::block::epoch::Epoch;
use hpp::fee::Credits;

use hpp::version::PlatformVersion;

impl Drive {
    /// Gets the total credits to be distributed for the Epoch.
    pub(super) fn get_epoch_total_credits_for_distribution_v0(
        &self,
        epoch_tree: &Epoch,
        transaction: TransactionArg,
        platform_version: &PlatformVersion,
    ) -> Result<Credits, Error> {
        let storage_pool_credits = self.get_epoch_storage_credits_for_distribution(
            epoch_tree,
            transaction,
            platform_version,
        )?;

        let processing_pool_credits = self.get_epoch_processing_credits_for_distribution(
            epoch_tree,
            transaction,
            platform_version,
        )?;

        storage_pool_credits
            .checked_add(processing_pool_credits)
            .ok_or_else(|| get_overflow_error("overflow getting total credits for distribution"))
    }
}

#[cfg(test)]
mod tests {
    use crate::drive::batch::grovedb_op_batch::GroveDbOpBatchV0Methods;
    use crate::drive::batch::GroveDbOpBatch;
    use crate::fee_pools::epochs::operations_factory::EpochOperations;
    use crate::tests::helpers::setup::setup_drive_with_initial_state_structure;
    use hpp::block::epoch::Epoch;
    use hpp::fee::Credits;

    use hpp::version::PlatformVersion;

    #[test]
    fn test_get_epoch_total_credits_for_distribution_v0() {
        let drive = setup_drive_with_initial_state_structure();
        let transaction = drive.grove.start_transaction();
        let platform_version = PlatformVersion::latest();

        let processing_fee: Credits = 42;
        let storage_fee: Credits = 1000;

        let epoch = Epoch::new(0).unwrap();

        let mut batch = GroveDbOpBatch::new();

        batch.push(
            epoch
                .update_processing_fee_pool_operation(processing_fee)
                .expect("should add operation"),
        );

        batch.push(
            epoch
                .update_storage_fee_pool_operation(storage_fee)
                .expect("should add operation"),
        );

        drive
            .grove_apply_batch(batch, false, Some(&transaction), &platform_version.drive)
            .expect("should apply batch");

        let retrieved_combined_fee = drive
            .get_epoch_total_credits_for_distribution(&epoch, Some(&transaction), platform_version)
            .expect("should get combined fee");

        assert_eq!(retrieved_combined_fee, processing_fee + storage_fee);
    }
}
