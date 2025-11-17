/**
 * Credit controller
 * Handles credit transactions and history
 */

const { CreditTransaction, User } = require('../models');

// @desc    Get user's credit transactions
// @route   GET /api/credits/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await CreditTransaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const user = await User.findByPk(req.user.id, {
      attributes: ['credits']
    });

    res.json({
      success: true,
      data: {
        currentCredits: user.credits,
        transactions
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credit transactions'
    });
  }
};

// @desc    Purchase credits (placeholder for payment integration)
// @route   POST /api/credits/purchase
// @access  Private
exports.purchaseCredits = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // TODO: Integrate with payment gateway (PayPal, Stripe, etc.)
    // For now, just simulate purchase

    await CreditTransaction.create({
      userId: req.user.id,
      amount: amount,
      type: 'purchase',
      reason: `Purchased ${amount} credits`
    });

    await User.increment('credits', { by: amount, where: { id: req.user.id } });

    const user = await User.findByPk(req.user.id, {
      attributes: ['credits']
    });

    res.json({
      success: true,
      message: 'Credits purchased successfully',
      data: {
        currentCredits: user.credits
      }
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing credits'
    });
  }
};
